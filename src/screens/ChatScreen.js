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
import useSettingsStore from '../store/useSettingsStore';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import { sendMessageToPerplexity } from '../services/perplexityApi';
import { dailyGreeting, formatDate } from '../utils/greetings';

const ChatScreen = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const {
    userName,
    theme,
    primaryColor,
    chatHistory,
    addMessage,
    chatSessions,
    saveChatSession,
    loadChatSession,
    deleteChatSession,
  } = useSettingsStore();

  const isDark = theme === 'dark';

  useEffect(() => {
    // Mostrar mensaje de bienvenida si el chat está vacío
    if (chatHistory.length === 0) {
      const welcomeMessage = {
        id: Date.now().toString(),
        text: dailyGreeting(userName),
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      addMessage(welcomeMessage);
    }
  }, [addMessage, chatHistory.length, userName]);

  const handleSendMessage = async (text) => {
    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now().toString(),
      text: text,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    await addMessage(userMessage);
    setIsLoading(true);

    // Scroll al final
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Preparar historial de conversación para la API
      const conversationHistory = chatHistory.map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Enviar a la API de Perplexity
      const response = await sendMessageToPerplexity(text, userName, conversationHistory);

      // Agregar respuesta del bot
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      await addMessage(botMessage);

      // Scroll al final
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: `Lo siento ${userName}, ocurrió un error. Por favor intenta nuevamente.`,
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
      const welcomeMessage = {
        id: Date.now().toString(),
        text: dailyGreeting(userName),
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      await addMessage(welcomeMessage);
    }
  };

  const handleLoadSession = async (sessionId) => {
    loadChatSession(sessionId);
    setShowHistoryModal(false);
  };

  const handleDeleteSession = async (sessionId) => {
    await deleteChatSession(sessionId);
  };

  const renderMessage = ({ item }) => <ChatMessage message={item.text} isUser={item.isUser} />;

  const renderHistoryModal = () => (
    <Modal
      visible={showHistoryModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowHistoryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Conversaciones Anteriores
            </Text>
            <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
              <Ionicons name="close" size={28} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={chatSessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[styles.sessionItem, { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5' }]}
              >
                <TouchableOpacity
                  style={styles.sessionInfo}
                  onPress={() => handleLoadSession(item.id)}
                >
                  <Text
                    style={[styles.sessionPreview, { color: isDark ? '#FFFFFF' : '#000000' }]}
                    numberOfLines={2}
                  >
                    {item.preview}
                  </Text>
                  <Text style={[styles.sessionDate, { color: isDark ? '#8E8E93' : '#666666' }]}>
                    {formatDate(item.date)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteSession(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={64}
                  color={isDark ? '#666666' : '#CCCCCC'}
                />
                <Text style={[styles.emptyText, { color: isDark ? '#666666' : '#999999' }]}>
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
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
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
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newChatText}>Nuevo Chat</Text>
        </TouchableOpacity>
      )}

      {/* Lista de mensajes */}
      <FlatList
        ref={flatListRef}
        data={chatHistory}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Indicador de carga */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={primaryColor} />
          <Text style={[styles.loadingText, { color: isDark ? '#8E8E93' : '#666666' }]}>
            TimoBot está escribiendo...
          </Text>
        </View>
      )}

      {/* Input de mensaje */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />

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
    paddingVertical: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  newChatText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionPreview: {
    fontSize: 16,
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default ChatScreen;
