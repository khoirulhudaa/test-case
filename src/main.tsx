import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 jam
      staleTime: 1000 * 60 * 5, // 5 menit
    }
  }
})

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  throttleTime: 1000
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{persister}}>
      <App />
    </PersistQueryClientProvider>
  </StrictMode>,
)
