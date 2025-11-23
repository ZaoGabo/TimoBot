import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useThemeStore from '../store/useThemeStore';
import useUserStore from '../store/useUserStore';
import useChatStore from '../store/useChatStore';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import { sendMessageToPerplexityStreaming } from '../services/perplexityApi';
import { dailyGreeting, formatDate } from '../utils/greetings';
import {
    Colors,
    getThemeColors,
    Typography,
    Spacing,
    BorderRadius,
    Layout,
    PerformanceConfig,
    Config,
} from '../constants';

// Define types for navigation
type RootStackParamList = {
    Chat: undefined;
    Settings: undefined;
};

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

interface ChatScreenProps {
    navigation: ChatScreenNavigationProp;
}

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
}

interface ChatSession {
    id: string;
    preview: string;
    date: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
    const flatListRef = useRef<FlatList>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
    const [streamingText, setStreamingText] = useState<string>(''); // For typewriter effect
    const [isStreaming, setIsStreaming] = useState<boolean>(false);

    const { userName } = useUserStore();
    const { theme, primaryColor } = useThemeStore();
    const {
        chatHistory,
        addMessage,
        chatSessions,
        saveChatSession,
        loadChatSession,
        deleteChatSession,
    } = useChatStore();

    const isDark = theme === 'dark';
    const themeColors = getThemeColors(isDark);

    useEffect(() => {
        // Mostrar mensaje de bienvenida si el chat está vacío
        if (chatHistory.length === 0) {
            const welcomeMessage: Message = {
                id: Date.now().toString(),
                text: dailyGreeting(userName || 'Usuario'),
                isUser: false,
                timestamp: new Date().toISOString(),
            };
            addMessage(welcomeMessage);
        }
    }, [addMessage, chatHistory.length, userName]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isLoading || isStreaming) return;

        setIsLoading(true);
        setStreamingText('');

        // Agregar mensaje del usuario
        const userMessage: Message = {
            id: Date.now().toString(),
            text: text.trim(),
            isUser: true,
            timestamp: new Date().toISOString(),
        };

        await addMessage(userMessage);

        // Scroll al final
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        try {
            // Preparar historial para la API
            const apiHistory = chatHistory
                .slice(-(chatHistory.length > Config.database.maxHistoryItems ? Config.database.maxHistoryItems : chatHistory.length))
                .map((msg: Message) => ({
                    role: (msg.isUser ? 'user' : 'assistant') as 'user' | 'assistant' | 'system',
                    content: msg.text,
                }));

            setIsLoading(false);
            setIsStreaming(true);

            let accumulatedText = '';

            // Use streaming API
            await sendMessageToPerplexityStreaming(
                text.trim(),
                userName || 'Usuario',
                apiHistory,
                // onChunk callback
                (chunk: string) => {
                    accumulatedText += chunk;
                    setStreamingText(accumulatedText);
                    // Auto-scroll during streaming
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 50);
                },
                // onComplete callback
                async () => {
                    setIsStreaming(false);
                    setStreamingText('');

                    const botMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        text: accumulatedText,
                        isUser: false,
                        timestamp: new Date().toISOString(),
                    };

                    await addMessage(botMessage);

                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                },
                // onError callback
                async (errorText: string) => {
                    setIsStreaming(false);
                    setStreamingText('');

                    const errorMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        text: errorText,
                        isUser: false,
                        timestamp: new Date().toISOString(),
                    };

                    await addMessage(errorMessage);
                }
            );
        } catch (error) {
            console.error('Error sending message:', error);
            setIsStreaming(false);
            setStreamingText('');
            setIsLoading(false); // Ensure loading is off if an error occurs before streaming starts

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `Lo siento ${userName || 'Usuario'}, ocurrió un error. Por favor intenta nuevamente.`,
                isUser: false,
                timestamp: new Date().toISOString(),
            };

            await addMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = async () => {
        if (chatHistory.length > 1) {
            // Más que solo el mensaje de bienvenida
            await saveChatSession();

            // Agregar nuevo mensaje de bienvenida
            const welcomeMessage: Message = {
                id: Date.now().toString(),
                text: dailyGreeting(userName || 'Usuario'),
                isUser: false,
                timestamp: new Date().toISOString(),
            };
            await addMessage(welcomeMessage);
        }
    };

    const handleLoadSession = async (sessionId: string) => {
        loadChatSession(sessionId);
        setShowHistoryModal(false);
    };

    const handleDeleteSession = async (sessionId: string) => {
        await deleteChatSession(sessionId);
    };

    const renderMessage = ({ item }: { item: Message }) => <ChatMessage message={item.text} isUser={item.isUser} />;

    const renderHistoryModal = () => (
        <Modal
            visible={showHistoryModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowHistoryModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: themeColors.surface }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                            Conversaciones Anteriores
                        </Text>
                        <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                            <Ionicons name="close" size={Layout.iconSize.lg} color={themeColors.text} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={chatSessions}
                        keyExtractor={(item: ChatSession) => item.id}
                        renderItem={({ item }: { item: ChatSession }) => (
                            <View
                                style={[styles.sessionItem, { backgroundColor: themeColors.surfaceSecondary }]}
                            >
                                <TouchableOpacity
                                    style={styles.sessionInfo}
                                    onPress={() => handleLoadSession(item.id)}
                                >
                                    <Text
                                        style={[styles.sessionPreview, { color: themeColors.text }]}
                                        numberOfLines={2}
                                    >
                                        {item.preview}
                                    </Text>
                                    <Text style={[styles.sessionDate, { color: themeColors.textSecondary }]}>
                                        {formatDate(item.date)}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteSession(item.id)}
                                >
                                    <Ionicons name="trash-outline" size={Layout.iconSize.sm} color={Colors.error} />
                                </TouchableOpacity>
                            </View>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons
                                    name="chatbubbles-outline"
                                    size={Layout.iconSize['5xl']}
                                    color={themeColors.textTertiary}
                                />
                                <Text style={[styles.emptyText, { color: themeColors.textTertiary }]}>
                                    No hay conversaciones anteriores
                                </Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Header
                title="TimoBot"
                showSettings={true}
                showHistory={true}
                onSettingsPress={() => navigation.navigate('Settings')}
                onHistoryPress={() => setShowHistoryModal(true)}
            />

            {/* Botón de nuevo chat */}
            {chatHistory.length > 1 && (
                <TouchableOpacity
                    style={[styles.newChatButton, { backgroundColor: primaryColor }]}
                    onPress={handleNewChat}
                >
                    <Ionicons name="add" size={Layout.iconSize.sm} color={Colors.light.background} />
                    <Text style={styles.newChatText}>Nuevo Chat</Text>
                </TouchableOpacity>
            )}

            {/* Lista de mensajes */}
            <FlatList
                ref={flatListRef}
                data={chatHistory}
                renderItem={renderMessage}
                keyExtractor={(item: Message) => item.id}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                windowSize={PerformanceConfig.flatList.windowSize}
                maxToRenderPerBatch={PerformanceConfig.flatList.maxToRenderPerBatch}
                updateCellsBatchingPeriod={PerformanceConfig.flatList.updateCellsBatchingPeriod}
                removeClippedSubviews={true}
                initialNumToRender={PerformanceConfig.flatList.initialNumToRender}
            />

            {/* Mensaje en streaming (typewriter effect) */}
            {isStreaming && streamingText && (
                <View style={styles.streamingMessageContainer}>
                    <ChatMessage message={streamingText} isUser={false} />
                </View>
            )}

            {/* Indicador de carga */}
            {isLoading && !isStreaming && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={primaryColor} />
                    <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
                        TimoBot está escribiendo...
                    </Text>
                </View>
            )}

            {/* Input de mensaje */}
            <ChatInput onSend={handleSendMessage} disabled={isLoading || isStreaming} />

            {/* Modal de historial */}
            {renderHistoryModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageList: {
        paddingVertical: Spacing.sm,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
    },
    loadingText: {
        marginLeft: Spacing.sm,
        fontSize: Typography.fontSize.sm,
    },
    newChatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Spacing.base,
        marginTop: Spacing.sm,
        marginBottom: Spacing.xs,
        paddingVertical: 10,
        paddingHorizontal: Spacing.base,
        borderRadius: BorderRadius.lg,
    },
    newChatText: {
        color: Colors.light.background,
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.semibold,
        marginLeft: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.overlay(0.5),
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '70%',
        borderTopLeftRadius: BorderRadius.lg,
        borderTopRightRadius: BorderRadius.lg,
        padding: Spacing.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.base,
    },
    modalTitle: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
    },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        borderRadius: BorderRadius.base,
        marginBottom: Spacing.sm,
    },
    sessionInfo: {
        flex: 1,
    },
    sessionPreview: {
        fontSize: Typography.fontSize.base,
        marginBottom: Spacing.xs,
    },
    sessionDate: {
        fontSize: Typography.fontSize.xs,
    },
    deleteButton: {
        padding: Spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing['5xl'],
    },
    emptyText: {
        fontSize: Typography.fontSize.base,
        marginTop: Spacing.base,
    },
    streamingMessageContainer: {
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.sm,
    },
});

export default ChatScreen;
