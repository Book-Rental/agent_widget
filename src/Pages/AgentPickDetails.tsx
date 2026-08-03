import { useEffect, useMemo, useState } from "react";
import { Rb_Text } from "@rentbook/rentbook-ui-lib";

import type { OrderStatus } from "../Types/AgentTypes";

import { useAgentOrderDetails } from "../hooks/useAgentOrderDetails";
import { useAgentLocation } from "../hooks/useAgentLocation";

import { callPhone } from "../utils/phone";
import { openMaps } from "../utils/openMaps";

import PageHeader from "../components/pickDetails/PageHeader";
import BookDetails from "../components/pickDetails/BookDetails";
import ContactCard from "../components/pickDetails/ContactCard";
import ProgressTimeline from "../components/pickDetails/ProgressTimeline";
import ActionCard from "../components/pickDetails/ActionCard";
import { LocationCard } from "../components/pickDetails/LocationCard";
import { LocationStats } from "../components/pickDetails/LocationStats";

const AgentPickDetails = () => {
  const shipmentId = window.location.pathname.split("/").pop() ?? "";

  const { data: order, isLoading, isError } =
    useAgentOrderDetails(shipmentId);

  const [currentStatus, setCurrentStatus] =
    useState<OrderStatus>("Ready For Pickup");

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderStatus);
    }
  }, [order]);

  const isSellerToHub =
    order?.deliveryType === "SELLER_TO_HUB";

  const isHubToUser =
    order?.deliveryType === "HUB_TO_USER";

  const seller = order?.sellerDetails;
  const user = order?.userDetails;
  const hub = order?.hubDetails;

  const address = useMemo(() => {
    if (isSellerToHub) return seller?.address;
    if (isHubToUser) return user?.address;
    return undefined;
  }, [isSellerToHub, isHubToUser, seller, user]);

  const coordinates = address?.location?.coordinates;

const { distance } = useAgentLocation(coordinates);

  const timeline = useMemo(() => {
    if (!order) return [];

    return order.journeyHistory.map((item) => ({
      label: item.status,
      date: item.eventAt,
      description: item.remarks,
    }));
  }, [order]);

  const handleStatusChange = (value: string) => {
    setCurrentStatus(value as OrderStatus);

    console.log({
      orderId: order?.orderId,
      status: value,
    });
  };

  const goToVerification = () => {
    if (!order) return;

    window.history.pushState(
      {},
      "",
      `/agent-orders/${order.orderId}/pickup-verification`
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  if (isLoading) {
    return (
      <div className="p-10">
        <Rb_Text>Loading...</Rb_Text>
      </div>
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
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-3xl">

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

        {(seller || user) && (
          <ContactCard
            title={
              isSellerToHub
                ? "Pickup Contact"
                : "Delivery Contact"
            }
            name={
              isSellerToHub
                ? seller?.name ?? ""
                : user?.name ?? ""
            }
            phone={
              isSellerToHub
                ? seller?.phoneNumber
                : user?.phoneNumber
            }
            onCall={() =>
              callPhone(
                isSellerToHub
                  ? seller?.phoneNumber
                  : user?.phoneNumber
              )
            }
          />
        )}

        {isSellerToHub && seller?.address && (
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

{isSellerToHub && hub && currentStatus === "Pickup Completed" && (
  <LocationCard
    title="Hub Details"
    subtitle="Submit book to hub"
    name={hub.name}
    address={hub.address}
    city={`${hub.city}, ${hub.state}`}
    onMap={() => openMaps(hub.location)}
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