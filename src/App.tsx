import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { Home } from './app/home/Home';
import { Sidebar } from './app/sidebar/Sidebar';
import { Transactions } from './app/transactions/Transactions';
import { DARK_THEME, LIGHT_THEME } from './framework/theme';

export const App = () => {
  const [isDark, setIsDark] = React.useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved ? saved === 'dark' : false;
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme-mode', newTheme ? 'dark' : 'light');
  };

  const currentTheme = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeProvider theme={currentTheme}>
      <BrowserRouter>
        <StyledApp>
          <Sidebar isDark={isDark} onToggleTheme={toggleTheme} />
          <StyledMain>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/transactions"
                element={<Transactions userId="Fake-ID" />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </StyledMain>
        </StyledApp>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const StyledApp = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const StyledMain = styled.main`
  background-color: ${({ theme }) => theme.background};
  padding: 32px;
  flex-grow: 1;
  overflow: auto;
  transition: background-color 0.3s ease;
`;
