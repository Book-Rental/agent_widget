// import { useEffect, useState } from "react";
import "@rentbook/rentbook-ui-lib/microfrontend.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardLayout from "./Pages/DashboardLayout";
import AgentOrders from "./Pages/AgentOrders";
import AgentPickDetails from "./Pages/AgentPickDetails";
import PickupVerification from "./Pages/PickupVerification";
// import PickupSuccess from "./Pages/PickupSuccess";
import AgentDeliveryOrders from "./Pages/AgentDeliveryOrders";
import { useEffect } from "react";

interface AppProps {
  module: "pickup" | "delivery";
  view: | "orders" | "details" | "verification"  | "confirmation";
  shipmentId?: string;
}

const queryClient = new QueryClient();

// function App({ module: _module, view: _view }: AppProps) {
//   const [path, setPath] = useState(window.location.pathname);
//   const navigateTo = (newPath: string) => {
//     window.history.pushState({}, "", newPath);
//     window.dispatchEvent(new PopStateEvent("popstate"));
//   };

//   useEffect(() => {
//     const handleNavigation = () => {
//       setPath(window.location.pathname);
//     };
//     window.addEventListener(
//       "popstate",
//       handleNavigation
//     );
//     return () => {
//       window.removeEventListener(
//         "popstate",
//         handleNavigation
//       );
//     };
//   }, []);

//   // const renderPage = () => {
//   //   if(path === "/pickup-verification") {

//   //     return (
//   //       <PickupVerification
//   //         shipmentId={sellerPickupData.shipmentId}
//   //       />
//   //     );

//   //   }

//   //   if(path.startsWith("/agent-orders/")) {
//   //     const orderId = path.split("/")[2];
//   //     return (
//   //       <AgentPickDetails
//   //         orderId={orderId}
//   //       />
//   //     );
//   //   }

//   //   if(path === "/confirmation-page") {
//   //     return (
//   //       <PickupSuccess
//   //         orderId={sellerPickupData.orderId}
//   //         bookName={sellerPickupData.book.name}
//   //         pickedUpFrom="Madhapur, Hyderabad"
//   //         dateTime="28 Jul 2026, 11:30 AM"
//   //         onViewOrderDetails={()=>{
//   //           navigateTo("/agent-orders");
//   //         }}
//   //         onBackToOrders={()=>{}}
//   //       />
//   //     );

//   //   }

//   //   if(path === "/agent/pickup-orders") {
//   //     return (
//   //       <AgentOrders />
//   //     );
//   //   }

//   //   if(path === "/agent/delivery-orders") {
//   //     return (
//   //       <AgentDeliveryOrders />
//   //     );
//   //   }
//   //   return (
//   //     <AgentOrders />
//   //   );
//   // };
  
//   const renderPage = () => {

//   // Verification
//   if (
//     path.startsWith("/agent-orders/") &&
//     path.endsWith("/pickup-verification")
//   ) {
//     const shipmentId = path.split("/")[2];

//     return (
//       <PickupVerification shipmentId={shipmentId} />
//     );
//   }

//   // Success
//   if (
//     path.startsWith("/agent-orders/") &&
//     path.endsWith("/confirmation")
//   ) {
//     return (
//       <PickupSuccess
//         orderId=""
//         bookName=""
//         pickedUpFrom="Madhapur, Hyderabad"
//         dateTime="28 Jul 2026, 11:30 AM"
//         onViewOrderDetails={() =>
//           navigateTo("/agent/pickup-orders")
//         }
//         onBackToOrders={() =>
//           navigateTo("/agent/pickup-orders")
//         }
//       />
//     );
//   }

//   // Details
//   if (
//     path.startsWith("/agent-orders/")
//   ) {
//     const shipmentId = path.split("/")[2];

//     return (
//       <AgentPickDetails  shipmentId={shipmentId} />
//     );
//   }

//   if (path === "/agent/pickup-orders") {
//     return <AgentOrders />;
//   }

//   if (path === "/agent/delivery-orders") {
//     return <AgentDeliveryOrders />;
//   }

//   return <AgentOrders />;
// };
//   return (
//     <QueryClientProvider client={queryClient}>
//       <DashboardLayout
//         navigateTo={navigateTo}
//       >
//         {renderPage()}
//       </DashboardLayout>
//     </QueryClientProvider>
//   );
// }

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

        // case "confirmation":
        //    return shipmentId ? (
        //     // <PickupSuccess
        //     //   shipmentId={shipmentId}
        //     //   onViewOrderDetails={() =>
        //     //     navigateTo(`/agent/pickup-orders/${shipmentId}`)
        //     //   }
        //     //   onBackToOrders={() =>
        //     //     navigateTo("/agent/pickup-orders")
        //     //   }
        //     // />
        //   ) : null;
      }
    }

    if (module === "delivery" && view === "orders") {
      return <AgentDeliveryOrders />;
    }

    return <AgentOrders />;
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