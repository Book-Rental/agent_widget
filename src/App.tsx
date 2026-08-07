// import { useEffect, useState } from "react";
import "@rentbook/rentbook-ui-lib/microfrontend.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardLayout from "./Pages/DashboardLayout";
import AgentOrders from "./Pages/AgentOrders";
import AgentPickDetails from "./Pages/AgentPickDetails";
import PickupVerification from "./Pages/PickupVerification";
import PickupSuccess from "./Pages/PickupSuccess";
import AgentDeliveryOrders from "./Pages/AgentDeliveryOrders";
import { useEffect } from "react";

interface AppProps {
  module: "pickup" | "delivery";
  view: | "orders" | "details" | "verification"  | "confirmation";
  shipmentId?: string;
}

const queryClient = new QueryClient();

function App({ module, view, shipmentId }: AppProps) {
  const navigateTo = (newPath: string) => {
    window.history.pushState({}, "", newPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("widget-loading-status", {
        detail: false,
      })
    );
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("widget-loading-status", {
        detail: false,
      })
    );
  }, [module, view, shipmentId]);


  const renderPage = () => {
    if (module === "pickup") {
      switch (view) {
        case "orders":
          return <AgentOrders />;

        case "details":
          return shipmentId ? (
            <AgentPickDetails shipmentId={shipmentId} />
          ) : null;

        case "verification":
          return shipmentId ? (
            <PickupVerification shipmentId={shipmentId} />
          ) : null;

        case "confirmation":
           return shipmentId ? (
            <PickupSuccess
              shipmentId={shipmentId}
              onViewOrderDetails={() =>
                navigateTo(`/agent/pickup-orders/${shipmentId}`)
              }
              onBackToOrders={() =>
                navigateTo("/agent/pickup-orders")
              }
            />
          ) : null;
      }
    }

    if (module === "delivery") {
    switch (view) {
      case "orders":
        return <AgentDeliveryOrders />;

      case "details":
        return shipmentId ? (
          <AgentPickDetails shipmentId={shipmentId} />
        ) : null;

      case "verification":
      case "confirmation":
        // Not built yet — see note below
        return shipmentId ? (
          <AgentPickDetails shipmentId={shipmentId} />
        ) : null;
    }
  }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout navigateTo={navigateTo}>
        {renderPage()}
      </DashboardLayout>
    </QueryClientProvider>
  );
}

export default App;