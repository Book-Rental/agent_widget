import '@rentbook/rentbook-ui-lib/microfrontend.min.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { sellerPickupData } from './mock/pickup'
import PickupSuccess from './Pages/PickupSuccess'
import PickupVerification from './Pages/PickupVerification'

function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        Agent Widget
       <PickupVerification pickup={sellerPickupData} />
       <PickupSuccess
        orderId={sellerPickupData.orderId}
        bookName={sellerPickupData.book.name}
        pickedUpFrom="Madhapur, Hyderabad"
        dateTime="28 Jul 2026, 11:30 AM"
        onViewOrderDetails={() => {}}
        onBackToOrders={() => {}}
      />
      </QueryClientProvider>
    </>
  )
}

export default App
