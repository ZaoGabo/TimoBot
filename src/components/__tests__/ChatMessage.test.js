import React from 'react';
import { render } from '@testing-library/react-native';
import ChatMessage from '../ChatMessage';
import useThemeStore from '../../store/useThemeStore';

// Mock the theme store
jest.mock('../../store/useThemeStore');

describe('ChatMessage', () => {
  beforeEach(() => {
    // Reset mocks
    useThemeStore.mockReturnValue({
      theme: 'light',
      primaryColor: '#4A90E2',
      fontFamily: 'default',
    });
  });

  it('should render user message correctly', () => {
    const { getByText } = render(<ChatMessage message="Hola, ¿cómo estás?" isUser={true} />);

    expect(getByText('Hola, ¿cómo estás?')).toBeTruthy();
  });

  it('should render bot message correctly', () => {
    const { getByText } = render(
      <ChatMessage message="¡Hola! Estoy bien, gracias." isUser={false} />
    );

    expect(getByText('¡Hola! Estoy bien, gracias.')).toBeTruthy();
  });

  it('should apply correct styles for user message', () => {
    const { getByText } = render(<ChatMessage message="Test message" isUser={true} />);

    const messageElement = getByText('Test message');
    expect(messageElement).toBeTruthy();
  });

  it('should apply correct styles for bot message', () => {
    const { getByText } = render(<ChatMessage message="Test bot message" isUser={false} />);

    const messageElement = getByText('Test bot message');
    expect(messageElement).toBeTruthy();
  });

  it('should apply dark theme styles when theme is dark', () => {
    useThemeStore.mockReturnValue({
      theme: 'dark',
      primaryColor: '#4A90E2',
      fontFamily: 'default',
    });

    const { getByText } = render(<ChatMessage message="Dark theme message" isUser={false} />);

    expect(getByText('Dark theme message')).toBeTruthy();
  });

  it('should apply custom primary color to user messages', () => {
    const customColor = '#FF5733';
    useThemeStore.mockReturnValue({
      theme: 'light',
      primaryColor: customColor,
      fontFamily: 'default',
    });

    const { getByText } = render(<ChatMessage message="Custom color message" isUser={true} />);

    expect(getByText('Custom color message')).toBeTruthy();
  });

  it('should apply serif font family when selected', () => {
    useThemeStore.mockReturnValue({
      theme: 'light',
      primaryColor: '#4A90E2',
      fontFamily: 'serif',
    });

    const { getByText } = render(<ChatMessage message="Serif font message" isUser={false} />);

    expect(getByText('Serif font message')).toBeTruthy();
  });

  it('should apply monospace font family when selected', () => {
    useThemeStore.mockReturnValue({
      theme: 'light',
      primaryColor: '#4A90E2',
      fontFamily: 'monospace',
    });

    const { getByText } = render(<ChatMessage message="Monospace font message" isUser={false} />);

    expect(getByText('Monospace font message')).toBeTruthy();
  });
});
