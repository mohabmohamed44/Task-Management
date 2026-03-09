import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import { store } from '@/app/redux/store.ts';
import ThemeProvider from '@/app/Providers/ThemeProvider.tsx';
import { ModalProvider } from '@/app/Providers/ModalProvider';
import { HelmetProvider } from 'react-helmet-async';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ModalProvider>
          <ThemeProvider />
          <App />
        </ModalProvider>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
)
