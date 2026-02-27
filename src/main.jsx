import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './index.css';
import App from './App.jsx';

const theme = {
  primaryColor: 'teal',
  colors: {
    teal: [
      '#f0fdfa',
      '#ccfbf1',
      '#99f6e4',
      '#5eead4',
      '#2dd4bf',
      '#14b8a6',
      '#0d9488',
      '#0f766e',
      '#115e59',
      '#134e4a',
    ],
    cyan: [
      '#ecfeff',
      '#cffafe',
      '#a5f3fc',
      '#67e8f9',
      '#22d3ee',
      '#06b6d4',
      '#0891b2',
      '#0e7490',
      '#155e75',
      '#164e63',
    ],
  },
  defaultRadius: 'md',
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>
);
