import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import { store } from '@/app/redux/store.ts';
import ThemeProvider from '@/presentation/components/ThemeProvider.tsx';
import { ModalProvider } from '@/app/Providers/ModalProvider';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ModalProvider>
        <ThemeProvider />
        <App />
      </ModalProvider>
    </Provider>
  </StrictMode>,
)
