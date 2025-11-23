import axios from 'axios';
import { sendMessageToPerplexity, setApiKey, setUseMock } from '../perplexityApi';

// Mock axios
jest.mock('axios');

// Mock expo-constants
jest.mock('expo-constants', () => ({
    default: {
        expoConfig: {
            extra: {
                perplexityApiKey: 'test-key',
                perplexityProxyUrl: null,
                timobotApiKey: null,
                useMockApi: false,
            },
        },
    },
}));

describe('Perplexity API Service', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        // Suppress console.error in tests
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        // Reset to non-mock mode for most tests
        setUseMock(false);
        setApiKey('test-api-key');
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    describe('sendMessageToPerplexity', () => {
        it('should send message and return response', async () => {
            const mockResponse = {
                data: {
                    choices: [
                        {
                            message: {
                                content: 'Hello! How can I help you?',
                            },
                        },
                    ],
                },
            };

            axios.post.mockResolvedValueOnce(mockResponse);

            const response = await sendMessageToPerplexity('Hello', 'TestUser', []);

            expect(response).toBe('Hello! How can I help you?');
            expect(axios.post).toHaveBeenCalled();
        });

        it('should sanitize user input', async () => {
            const mockResponse = {
                data: {
                    choices: [{ message: { content: 'Response' } }],
                },
            };

            axios.post.mockResolvedValueOnce(mockResponse);

            await sendMessageToPerplexity('<script>alert("xss")</script>', 'User', []);

            const call = axios.post.mock.calls[0];
            const payload = call[1];

            // Should remove < and > characters
            expect(payload.messages.some(m => m.content.includes('<'))).toBe(false);
            expect(payload.messages.some(m => m.content.includes('>'))).toBe(false);
        });

        it('should include conversation history', async () => {
            const mockResponse = {
                data: {
                    choices: [{ message: { content: 'Response' } }],
                },
            };

            axios.post.mockResolvedValueOnce(mockResponse);

            const history = [
                { role: 'user', content: 'Previous message' },
                { role: 'assistant', content: 'Previous response' },
            ];

            await sendMessageToPerplexity('New message', 'User', history);

            const call = axios.post.mock.calls[0];
            const payload = call[1];

            expect(payload.messages).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ role: 'user', content: 'Previous message' }),
                    expect.objectContaining({ role: 'assistant', content: 'Previous response' }),
                ])
            );
        });

        it('should retry on network error', async () => {
            const networkError = new Error('Network Error');
            networkError.request = {};

            axios.isAxiosError = jest.fn().mockReturnValue(true);

            // First call fails, second succeeds
            axios.post
                .mockRejectedValueOnce(networkError)
                .mockResolvedValueOnce({
                    data: {
                        choices: [{ message: { content: 'Success after retry' } }],
                    },
                });

            const response = await sendMessageToPerplexity('Test', 'User', []);

            expect(response).toBe('Success after retry');
            expect(axios.post).toHaveBeenCalledTimes(2);
        });

        it('should retry on 500 error', async () => {
            const serverError = new Error('Server Error');
            serverError.response = { status: 500 };

            axios.isAxiosError = jest.fn().mockReturnValue(true);

            axios.post
                .mockRejectedValueOnce(serverError)
                .mockResolvedValueOnce({
                    data: {
                        choices: [{ message: { content: 'Success after retry' } }],
                    },
                });

            const response = await sendMessageToPerplexity('Test', 'User', []);

            expect(response).toBe('Success after retry');
            expect(axios.post).toHaveBeenCalledTimes(2);
        });

        it('should NOT retry on 401 error', async () => {
            const authError = new Error('Unauthorized');
            authError.response = { status: 401 };

            axios.isAxiosError = jest.fn().mockReturnValue(true);
            axios.post.mockRejectedValueOnce(authError);

            const response = await sendMessageToPerplexity('Test', 'User', []);

            expect(response).toContain('API key inválida');
            expect(axios.post).toHaveBeenCalledTimes(1); // No retry
        });

        it('should handle 429 rate limit error', async () => {
            const rateLimitError = new Error('Too Many Requests');
            rateLimitError.response = { status: 429 };

            axios.isAxiosError = jest.fn().mockReturnValue(true);
            axios.post.mockRejectedValueOnce(rateLimitError);

            const response = await sendMessageToPerplexity('Test', 'User', []);

            expect(response).toContain('Límite de solicitudes excedido');
        });

        it('should handle invalid response format', async () => {
            axios.post.mockResolvedValueOnce({
                data: {
                    // Missing choices array
                    invalid: 'format',
                },
            });

            const response = await sendMessageToPerplexity('Test', 'User', []);

            expect(response).toContain('error al procesar tu mensaje');
        });

        it('should use mock responses when enabled', async () => {
            setUseMock(true);

            const response = await sendMessageToPerplexity('Hola', 'TestUser', []);

            expect(response).toContain('TestUser');
            expect(axios.post).not.toHaveBeenCalled();
        });

        it('should handle empty input gracefully', async () => {
            const response = await sendMessageToPerplexity('   ', 'User', []);

            // Should return error message
            expect(response).toBeTruthy();
            expect(typeof response).toBe('string');
            expect(response).toContain('error');
        });

        it('should limit input length', async () => {
            const mockResponse = {
                data: {
                    choices: [{ message: { content: 'Response' } }],
                },
            };

            axios.post.mockResolvedValueOnce(mockResponse);

            const veryLongMessage = 'a'.repeat(10000);
            await sendMessageToPerplexity(veryLongMessage, 'User', []);

            const call = axios.post.mock.calls[0];
            const payload = call[1];
            const userMessage = payload.messages.find((m) => m.role === 'user');

            // Should be truncated to 5000 chars
            expect(userMessage.content.length).toBeLessThanOrEqual(5000);
        });
    });

    describe('setApiKey', () => {
        it('should update API key', () => {
            expect(() => setApiKey('new-key')).not.toThrow();
            expect(() => setApiKey('another-key')).not.toThrow();
        });
    });

    describe('setUseMock', () => {
        it('should toggle mock mode', () => {
            expect(() => setUseMock(true)).not.toThrow();
            expect(() => setUseMock(false)).not.toThrow();
        });
    });
});
