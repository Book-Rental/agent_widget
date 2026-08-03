import { useEffect, useState } from "react";
import "@rentbook/rentbook-ui-lib/microfrontend.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { sellerPickupData } from "./mock/pickup";

import DashboardLayout from "./Pages/DashboardLayout";
import AgentOrders from "./Pages/AgentOrders";
import AgentPickDetails from "./Pages/AgentPickDetails";
import PickupVerification from "./Pages/PickupVerification";
import PickupSuccess from "./Pages/PickupSuccess";
import AgentDeliveryOrders from "./Pages/AgentDeliveryOrders";

const queryClient = new QueryClient();

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const navigateTo = (newPath: string) => {
    window.history.pushState({}, "", newPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    const handleNavigation = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener(
      "popstate",
      handleNavigation
    );
    return () => {
      window.removeEventListener(
        "popstate",
        handleNavigation
      );
    };
  }, []);

  const renderPage = () => {
    if(path === "/pickup-verification") {

      return (
        <PickupVerification
          pickup={sellerPickupData}
        />
      );

    }

    if(path.startsWith("/agent-orders/")) {
      const orderId = path.split("/")[2];
      return (
        <AgentPickDetails
          orderId={orderId}
        />
      );
    }

    if(path === "/confirmation-page") {
      return (
        <PickupSuccess
          orderId={sellerPickupData.orderId}
          bookName={sellerPickupData.book.name}
          pickedUpFrom="Madhapur, Hyderabad"
          dateTime="28 Jul 2026, 11:30 AM"
          onViewOrderDetails={()=>{
            navigateTo("/agent-orders");
          }}
          onBackToOrders={()=>{}}
        />
      );

    }

    if(path === "/agent/pickup-orders") {
      return (
        <AgentOrders />
      );
    }

    if(path === "/agent/delivery-orders") {
      return (
        <AgentDeliveryOrders />
      );
    }
    return (
      <AgentOrders />
    );
  };
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout
        navigateTo={navigateTo}
      >
        {renderPage()}
      </DashboardLayout>
    </QueryClientProvider>
  );
}


export default App;