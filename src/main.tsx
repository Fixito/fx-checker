import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app.tsx';

import './index.css';

const rootElement = document.getElementById('root');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 1000 * 20, // 20 seconds,
    },
  },
});

if (!rootElement) {
  throw new Error('#root element not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NuqsAdapter>
  </StrictMode>,
);
