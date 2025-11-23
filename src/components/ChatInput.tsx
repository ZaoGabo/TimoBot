import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Alert,
    ActivityIndicator,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import useThemeStore from '../store/useThemeStore';
import { transcribeAudio, isHuggingFaceConfigured } from '../services/speechToText';
import {
    Colors,
    getThemeColors,
    Typography,
    getFontFamilyStyle,
    Spacing,
    BorderRadius,
    Layout,
    InputLimits,
    AnimationDurations,
} from '../constants';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
    const [message, setMessage] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
    const recording = useRef<Audio.Recording | null>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const { theme, primaryColor, fontFamily } = useThemeStore();
    const isDark = theme === 'dark';
    const themeColors = getThemeColors(isDark);
    const fontStyle = getFontFamilyStyle(fontFamily);

    // Pulse animation for recording indicator
    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.3,
                        duration: AnimationDurations.pulseDuration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: AnimationDurations.pulseDuration,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording, pulseAnim]);

    const startRecording = async () => {
        try {
            // Check if HF is configured
            if (!isHuggingFaceConfigured()) {
                Alert.alert(
                    'Configuración requerida',
                    'Por favor configura tu token de Hugging Face para usar el reconocimiento de voz.'
                );
                return;
            }

            // Request permissions
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permiso denegado',
                    'Necesitamos acceso al micrófono para la entrada de voz.'
                );
                return;
            }

            // Set audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
            });

            // Start recording
            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            recording.current = newRecording;
            setIsRecording(true);
        } catch (err) {
            console.error('Error starting recording:', err);
            Alert.alert('Error', 'No se pudo iniciar la grabación.');
        }
    };

    const stopRecording = async () => {
        if (!recording.current) return;

        try {
            setIsRecording(false);
            await recording.current.stopAndUnloadAsync();

            const uri = recording.current.getURI();
            recording.current = null;

            // Transcribe audio
            if (uri) {
                setIsTranscribing(true);
                try {
                    const transcribedText = await transcribeAudio(uri);

                    if (transcribedText) {
                        setMessage(transcribedText);
                    } else {
                        Alert.alert('Sin audio', 'No se detectó voz. Intenta de nuevo.');
                    }
                } catch (error) {
                    console.error('Transcription error:', error);
                    Alert.alert(
                        'Error de transcripción',
                        (error as Error).message || 'No se pudo transcribir el audio. Intenta de nuevo.'
                    );
                } finally {
                    setIsTranscribing(false);
                }
            }
        } catch (err) {
            console.error('Error stopping recording:', err);
            Alert.alert('Error', 'No se pudo detener la grabación.');
        }
    };

    const handleSend = () => {
        if (message.trim() && onSend) {
            onSend(message.trim());
            setMessage('');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={[styles.container, { backgroundColor: themeColors.background }]}>
                {/* Recording indicator */}
                {isRecording && (
                    <Animated.View
                        style={[
                            styles.recordingIndicator,
                            {
                                backgroundColor: `${primaryColor}20`,
                                transform: [{ scale: pulseAnim }],
                            },
                        ]}
                    >
                        <View style={[styles.recordingDot, { backgroundColor: Colors.recording }]} />
                        <Text style={[styles.recordingText, { color: themeColors.text }, fontStyle]}>
                            Grabando...
                        </Text>
                    </Animated.View>
                )}

                {/* Transcribing indicator */}
                {isTranscribing && (
                    <View style={[styles.transcribingContainer, { backgroundColor: `${primaryColor}20` }]}>
                        <ActivityIndicator size="small" color={primaryColor} />
                        <Text style={[styles.transcribingText, { color: themeColors.text }, fontStyle]}>
                            Transcribiendo...
                        </Text>
                    </View>
                )}

                {/* Text input */}
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: themeColors.surfaceSecondary,
                            color: themeColors.text,
                        },
                        fontStyle,
                    ]}
                    placeholder="Escribe o mantén presionado 🎤..."
                    placeholderTextColor={themeColors.textTertiary}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={InputLimits.messageMaxLength}
                    editable={!disabled && !isRecording && !isTranscribing}
                    accessible={true}
                    accessibilityLabel="Campo de texto para mensaje"
                    accessibilityHint="Escribe tu mensaje aquí o usa el micrófono"
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1.5}
                />

                {/* Microphone button */}
                <TouchableOpacity
                    style={[
                        styles.micButton,
                        isRecording && { backgroundColor: `${primaryColor}20` },
                    ]}
                    onPressIn={startRecording}
                    onPressOut={stopRecording}
                    disabled={disabled || isTranscribing}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={isRecording ? "Grabando mensaje" : "Grabar mensaje de voz"}
                    accessibilityHint="Mantén presionado para grabar, suelta para enviar"
                    accessibilityState={{ disabled: disabled || isTranscribing, checked: isRecording }}
                >
                    <Ionicons
                        name={isRecording ? 'mic' : 'mic-outline'}
                        size={Layout.iconSize.base}
                        color={isRecording ? Colors.recording : isTranscribing ? Colors.disabled : primaryColor}
                    />
                </TouchableOpacity>

                {/* Send button */}
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        { backgroundColor: message.trim() && !disabled ? primaryColor : Colors.disabled },
                    ]}
                    onPress={handleSend}
                    disabled={!message.trim() || disabled || isRecording || isTranscribing}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Enviar mensaje"
                    accessibilityHint="Envía el mensaje escrito al chat"
                    accessibilityState={{ disabled: !message.trim() || disabled }}
                >
                    <Ionicons name="send" size={Layout.iconSize.sm} color={Colors.light.background} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        width: '100%',
    },
    container: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
    },
    input: {
        flex: 1,
        fontSize: Typography.fontSize.base,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        maxHeight: 100,
    },
    micButton: {
        width: Layout.buttonSize.base,
        height: Layout.buttonSize.base,
        borderRadius: Layout.buttonSize.base / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Spacing.sm,
    },
    sendButton: {
        width: Layout.buttonSize.base,
        height: Layout.buttonSize.base,
        borderRadius: Layout.buttonSize.base / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Spacing.sm,
    },
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    recordingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: Spacing.sm,
    },
    recordingText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.semibold,
    },
    transcribingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    transcribingText: {
        fontSize: Typography.fontSize.sm,
        marginLeft: Spacing.sm,
        fontWeight: Typography.fontWeight.semibold,
    },
});

export default React.memo(ChatInput);
