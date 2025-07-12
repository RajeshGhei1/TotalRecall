
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import App from './App.tsx'
import './index.css'

// Create a client with optimized settings for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      // Optimize for better performance
      networkMode: 'online',
      // Reduce unnecessary re-renders
      notifyOnChangeProps: ['data', 'error'],
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
})

// Use createRoot for better performance (React 18+)
const root = createRoot(document.getElementById("root")!);

// Wrap in error boundary for better error handling
root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryClientProvider>
);
