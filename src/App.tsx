import { useEffect, useState } from "react";
import "@rentbook/rentbook-ui-lib/microfrontend.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sellerPickupData } from "./mock/pickup";
import AgentOrders from "./Pages/AgentOrders";
import AgentPickDetails from "./Pages/AgentPickDetails";
import PickupVerification from "./Pages/PickupVerification";
import PickupSuccess from "./Pages/PickupSuccess";

const queryClient = new QueryClient();

function App() {
const navigateTo = (path: string) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

const renderPage = () => {
  if (path.includes("/pickup-verification")) {
    return <PickupVerification pickup={sellerPickupData} />;
  }

  if (path.startsWith("/agent-orders/")) {
    return <AgentPickDetails />;
  }

  if(path.startsWith("/confirmation-page")) {
    return <PickupSuccess
        orderId={sellerPickupData.orderId}
        bookName={sellerPickupData.book.name}
        pickedUpFrom="Madhapur, Hyderabad"
        dateTime="28 Jul 2026, 11:30 AM"
        onViewOrderDetails={() => {
            navigateTo(
              `/`
            );
          }}
        onBackToOrders={() => {}}
      />
  }

  return <AgentOrders />;
};

  return (
    <QueryClientProvider client={queryClient}>
      {renderPage()}
    </QueryClientProvider>
  );
}

export default App;

