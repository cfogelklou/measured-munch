import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.tsx';
import { LSProvider } from './context.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LSProvider>
      <App />
    </LSProvider>
  </StrictMode>,
);
