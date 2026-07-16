import { RouterProvider } from 'react-router'
import { appRouter } from "./app/routes/router.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModalProvider } from './app/Providers/ModalProvider'
import { Analytics } from "@vercel/analytics/react"
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: false,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    },
  },
});

function App({ hydratedState }: { hydratedState?: any}) {
  if (hydratedState) {
    hydrate(queryClient, hydratedState);
  }
  return (
    <QueryClientProvider client={queryClient}> 
      <ModalProvider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
        <RouterProvider router={appRouter} />
        <Analytics />
        <Toaster 
          position='top-center'
          reverseOrder={false}
        />
      </ModalProvider>
    </QueryClientProvider>
  )
}

export default App