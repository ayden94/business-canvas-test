import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/tailwind.css';
import { DialogWrapper } from './components/Dialog/DialogWrapper.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DialogWrapper>
      <App />
    </DialogWrapper>
  </StrictMode>,
);
