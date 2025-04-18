import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';
import CustomSnackbarProvider from '../src/components/CustomSnackbarProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomSnackbarProvider>
      <App />
    </CustomSnackbarProvider>
  </StrictMode>,
);
