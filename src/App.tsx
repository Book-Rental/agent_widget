import '@rentbook/rentbook-ui-lib/microfrontend.min.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        Agent Widget
      </QueryClientProvider>
    </>
  )
}

export default App
