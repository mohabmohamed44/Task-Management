import { RouterProvider } from 'react-router'
import { appRouter } from "./app/router.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModalProvider } from './app/Providers/ModalProvider'
import './App.css'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}> 
      <ModalProvider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
        <RouterProvider router={appRouter} />
        <Toaster 
          position='top-center'
          reverseOrder={false}
        />
      </ModalProvider>
    </QueryClientProvider>
  )
}

export default App