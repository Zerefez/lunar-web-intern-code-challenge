import * as React from 'react';
import styled, { keyframes } from 'styled-components';

interface StateProps {
  type: 'loading' | 'error' | 'empty';
  message?: string;
  onRetry?: () => void;
}

export const AppState: React.FC<StateProps> = ({ type, message, onRetry }) => {
  const config = {
    loading: {
      icon: <Spinner />,
      title: message || "Loading transactions...",
      subtitle: "Please wait while we fetch your data"
    },
    error: {
      icon: "⚠️",
      title: message || "Something went wrong",
      subtitle: "Unable to load transactions",
      showRetry: true
    },
    empty: {
      icon: "📋",
      title: "No transactions found",
      subtitle: "You don't have any transactions yet"
    }
  }[type];

  return (
    <Container>
      <Icon>{config.icon}</Icon>
      <Title>{config.title}</Title>
      <Subtitle>{config.subtitle}</Subtitle>
      {config.showRetry && onRetry && (
        <RetryButton onClick={onRetry}>Try Again</RetryButton>
      )}
    </Container>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${({ theme }) => theme.fade2};
  border-top: 3px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  min-height: 400px;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.surfaceStroke};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.medium};
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.8;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.secondaryText};
  margin: 0 0 24px 0;
  max-width: 300px;
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.button.primary.default};
  color: ${({ theme }) => theme.textInvert};
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.button.primary.interactive};
  }
`;
