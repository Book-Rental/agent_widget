
import "@rentbook/rentbook-ui-lib/microfrontend.min.css";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

import DashboardLayout from "./Pages/DashboardLayout";
import AgentOrders from "./Pages/AgentOrders";
import AgentPickDetails from "./Pages/AgentPickDetails";
import PickupVerification from "./Pages/PickupVerification";
import PickupSuccess from "./Pages/PickupSuccess";
import AgentDeliveryOrders from "./Pages/AgentDeliveryOrders";

interface AppProps {
  module: "pickup" | "delivery";
  view: "orders" | "details" | "verification" | "confirmation";
}

const queryClient = new QueryClient();

function App({ module, view }: AppProps) {
  const [pathname, setPathname] = useState(
    window.location.pathname
  );

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("widget-loading-status", {
        detail: false,
      })
    );
  }, [module, view, pathname]);

  const navigateTo = (newPath: string) => {
    window.history.pushState({}, "", newPath);

    setPathname(newPath);

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  const renderPickupPage = () => {
    if (pathname.includes("/pickup-verification")) {
      return <PickupVerification />;
    }

    if (pathname.includes("/pickup-confirmation")) {
      return (
        <PickupSuccess
          onViewOrderDetails={() => {
            navigateTo("/agent/pickup-orders");
          }}
          onBackToOrders={() => {
            navigateTo("/agent/pickup-orders");
          }}
        />
      );
    }

    const isPickupDetails = pathname.match(
      /^\/agent\/pickup-orders\/[^/]+$/
    );

    if (isPickupDetails) {
      return <AgentPickDetails />;
    }

    return <AgentOrders />;
  };

  const renderDeliveryPage = () => {
    switch (view) {
      case "orders":
        return <AgentDeliveryOrders />;

      case "details":
        return <AgentPickDetails />;

      default:
        return <AgentDeliveryOrders />;
    }
  };

  const renderPage = () => {
    if (module === "pickup") {
      return renderPickupPage();
    }

    if (module === "delivery") {
      return renderDeliveryPage();
    }

    return null;
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

