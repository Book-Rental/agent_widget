import "@rentbook/rentbook-ui-lib/microfrontend.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AgentOrders from "./Pages/AgentOrders";
import AgentPickDetails from "./Pages/AgentPickDetails";
const queryClient = new QueryClient();

function App() {
  const path = window.location.pathname;

  const renderPage = () => {
    if (path.startsWith("/agent-orders/")) {
      return <AgentPickDetails />;
    }

    // if (path === "/pickup-verification") {
    //   return <PickupVerification />;
    // }

    // if (path === "/pickup-success") {
    //   return <PickupSuccess />;
    // }

    //  <PickupVerification pickup={sellerPickupData} />
    //    <PickupSuccess
    //     orderId={sellerPickupData.orderId}
    //     bookName={sellerPickupData.book.name}
    //     pickedUpFrom="Madhapur, Hyderabad"
    //     dateTime="28 Jul 2026, 11:30 AM"
    //     onViewOrderDetails={() => {}}
    //     onBackToOrders={() => {}}
    //   />
    return <AgentOrders />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      {renderPage()}
    </QueryClientProvider>
  );
}

export default App;