import { useEffect, useMemo, useState } from "react";
import { Rb_LoadingSpinner, Rb_Text } from "@rentbook/rentbook-ui-lib";
import type { OrderStatus } from "../Types/AgentTypes";
import { useAgentOrderDetails } from "../hooks/useAgentOrderDetails";
// import { useAgentLocation } from "../hooks/useAgentLocation";
import { callPhone } from "../utils/phone";
import { openMaps } from "../utils/openMaps";
import PageHeader from "../components/pickDetails/PageHeader";
import BookDetails from "../components/pickDetails/BookDetails";
import ContactCard from "../components/pickDetails/ContactCard";
import ProgressTimeline from "../components/pickDetails/ProgressTimeline";
import ActionCard from "../components/pickDetails/ActionCard";
import { LocationCard } from "../components/pickDetails/LocationCard";
import { useUpdateShipmentStatus } from "../hooks/useUpdateShipmentStatus";
import { STATUS_CONFIG } from "../constants/shipmentStatus";

type AgentPickDetailsProps = {
   shipmentId: string;
};

const AgentPickDetails = ({ shipmentId }: AgentPickDetailsProps) => {
  // const shipmentId = window.location.pathname.split("/").pop() ?? "";

  const { data: order, isLoading, isError } = useAgentOrderDetails(shipmentId);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("Ready For Pickup");
  useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderStatus);
    }
  }, [order]);

  const isSellerToHub = order?.deliveryType === "SELLER_TO_HUB";
  const isHubToUser = order?.deliveryType === "HUB_TO_USER";
const seller = order?.sellerDetails;
const user = order?.userDetails;
const hub = order?.hubDetails;

const showSellerDetails =
  isSellerToHub &&
  [
    "Pickup Assigned",
    "Out For Pickup",
   
  ].includes(currentStatus);

const showHubDetails =
  isSellerToHub &&
  [
     "Pickup Completed",
    "Arrived At Origin Hub",
    "Submitted to Admin",
    "Sorting Completed",
  ].includes(currentStatus);
 const timeline = useMemo(() => {
  if (!order) return [];

  const sellerTimeline: OrderStatus[] = [
    "Pickup Assigned",
    "Out For Pickup",
    "Pickup Completed",
    "Arrived At Origin Hub",
  ];

  const deliveryTimeline: OrderStatus[] = [
    "Delivery Agent Assigned",
    "Out For Delivery",
    "Delivered",
  ];

  const statuses =
    order.deliveryType === "SELLER_TO_HUB"
      ? sellerTimeline
      : deliveryTimeline;

return statuses.map((status) => {
  const history = order.journeyHistory.find(
    (item) => item.status === status
  );

  return {
    label:
      status === "Arrived At Origin Hub"
        ? "Completed"
        : status,
    date: history?.eventAt,
    description: history?.remarks,
  };
});
}, [order]);

  const { mutate: updateStatus } = useUpdateShipmentStatus();
  const agentId = "6a6b10202eb459f877594bb0";
  const handleStatusChange = (value: string) => {
    if (!order) return;
    const status = value as OrderStatus;
      console.log({
      shipmentId: order.shipmentId,
      payload:{
              status,
              event: STATUS_CONFIG[status]?.event,
              remarks: STATUS_CONFIG[status]?.remarks,
              agentId,
              updatedBy: agentId
          }
      });
      console.log("Order:", order);
      console.log("Props shipmentId:", shipmentId);
      console.log("Order shipmentId:", order?.shipmentId);
    updateStatus({
        shipmentId: order.shipmentId!,
        payload:{
            status,
            event:STATUS_CONFIG[status]!.event,
            remarks:STATUS_CONFIG[status]!.remarks,
            agentId,
            updatedBy:agentId,
        }
    },{
        onSuccess(){
            setCurrentStatus(status);
        }
    });
  };

  // const handleStatusChange = (value: string) => {
  //   setCurrentStatus(value as OrderStatus);

  //   console.log({
  //     orderId: order?.orderId,
  //     status: value,
  //   });
  // };

  const goToVerification = () => {
    if (!order) return;
    console.log(order);
    window.history.pushState(
      {},
      "",
      // `/agent-orders/${order.shipmentId}/pickup-verification`
      `/agent/pickup-orders/${shipmentId}/pickup-verification`
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  if (isLoading) {
    return (
        <Rb_LoadingSpinner />
    );
  }

  if (isError || !order) {
    return (
      <div className="p-10">
        <Rb_Text>Order not found</Rb_Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl">

      <PageHeader
  title={
    order.deliveryType === "HUB_TO_USER"
      ? "Delivery Details"
      : "Pickup Details"
  }
  order={order}
  orderNumber={order.orderNumber}
  currentStatus={currentStatus}
  deliveryType={order.deliveryType}
  onStatusChange={handleStatusChange}
/>

        <BookDetails item={order.items[0]} />

{showSellerDetails && seller && (
  <ContactCard
    title="Pickup Contact"
    name={seller.name}
    phone={seller.phoneNumber}
    onCall={() => callPhone(seller.phoneNumber)}
  />
)}

{showHubDetails && hub && (
  <ContactCard
    title="Hub Contact"
    name={hub.name}
    onCall={() => {}}
  />
)}

{isHubToUser && user && (
  <ContactCard
    title="Delivery Contact"
    name={user.name}
    phone={user.phoneNumber}
    onCall={() => callPhone(user.phoneNumber)}
  />
)}

      {showSellerDetails && seller?.address && (
  <LocationCard
    title="Pickup Location"
    subtitle="Seller pickup address"
    name={seller.address.name}
    address={seller.address.street}
    city={`${seller.address.city}, ${seller.address.state}`}
    zipCode={seller.address.zipCode}
    onMap={() => openMaps(seller.address.location)}
  />
)}

{showHubDetails && hub && (
  <LocationCard
    title="Hub Details"
    subtitle="Submit book to hub"
    name={hub.name}
    address={hub.address}
    city={`${hub.city}, ${hub.state}`}
    onMap={() => {}}
  />
)}

{isHubToUser && user?.address && (
  <LocationCard
    title="Delivery Location"
    subtitle="Customer address"
    name={user.name}
    address={user.address.street}
    city={`${user.address.city}, ${user.address.state}`}
    zipCode={user.address.zipCode}
    onMap={() => openMaps(user.address.location)}
  />
)}
        <ProgressTimeline
          timeline={timeline}
        />

        <ActionCard
          status={currentStatus}
          onVerify={goToVerification}
          onSorting={() =>
            handleStatusChange("Sorting Completed")
          }
          onDelivered={() =>
            handleStatusChange("Delivered")
          }
        />

      </div>
    </div>
  );
};

export default AgentPickDetails;