import { useEffect, useMemo, useState } from "react";
import type { OrderStatus } from "../Types/AgentTypes";
import { useAgentOrderDetails } from "../hooks/useAgentOrderDetails";
import { useUpdateShipmentStatus } from "../hooks/useUpdateShipmentStatus";
import { callPhone } from "../utils/phone";
import { openMaps } from "../utils/openMaps";
import PageHeader from "../components/pickDetails/PageHeader";
import BookDetails from "../components/pickDetails/BookDetails";
import ContactCard from "../components/pickDetails/ContactCard";
import ProgressTimeline from "../components/pickDetails/ProgressTimeline";
import ActionCard from "../components/pickDetails/ActionCard";
import { LocationCard } from "../components/pickDetails/LocationCard";
import { STATUS_CONFIG } from "../constants/shipmentStatus";
import { ConfirmationModal } from "../components/orderDetails/ConfirmationModal";

import {
  Rb_Button,
  Rb_LoadingSpinner,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

import { FiRefreshCw } from "react-icons/fi";

const PICKUP_STATUSES: OrderStatus[] = [
  "Pickup Assigned",
  "Out For Pickup",
  "Pickup Completed",
  "Arrived At Origin Hub",
];

const DELIVERY_STATUSES: OrderStatus[] = [
  "Arrived At Destination Hub",
  "Delivery Agent Assigned",
  "Out For Delivery",
  "Delivered",
];

type DetailsBlockProps = {
  contactTitle: string;
  name: string;
  phone?: string;
  onCall?: () => void;
  locationTitle: string;
  locationSubtitle: string;
  address: string;
  city: string;
  zipCode: string;
  onMap?: () => void;
};

const DetailsBlock = ({
  contactTitle,
  name,
  phone,
  onCall,
  locationTitle,
  locationSubtitle,
  address,
  city,
  zipCode,
  onMap,
}: DetailsBlockProps) => (
  <div className="grid w-full min-w-0 items-stretch gap-6 md:grid-cols-2">
    <div className="min-w-0">
      <ContactCard
        title={contactTitle}
        name={name}
        phone={phone}
        onCall={onCall ?? (() => {})}
      />
    </div>

    <div className="min-w-0">
      <LocationCard
        title={locationTitle}
        subtitle={locationSubtitle}
        name={name}
        address={address}
        city={city}
        zipCode={zipCode}
        onMap={onMap ?? (() => {})}
      />
    </div>
  </div>
);

const AgentPickDetails = () => {
  const pathname = window.location.pathname; 

  const shipmentId = pathname.split("/").filter(Boolean).pop() ?? "";

  const agentId = window.HOST_USER_INFO?.referenceId ?? "";

  const {
    data: order,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAgentOrderDetails(shipmentId);

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("Ready For Pickup");
  const [isDeliveryConfirmationOpen, setIsDeliveryConfirmationOpen] = useState(false);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderStatus);
    }
  }, [order]);

  const isDeliveryJourney = DELIVERY_STATUSES.includes(currentStatus);
  const isPickupJourney = !isDeliveryJourney;
  const pageTitle = isDeliveryJourney ? "Delivery Details" : "Pick Up Details";
  const seller = order?.sellerDetails;
  const originHub = order?.hubDetails;
  const destinationHub = order?.destinationHubDetails;
  const user = order?.userDetails;

  const showSellerDetails =
    isPickupJourney &&
    ["Pickup Assigned", "Out For Pickup"].includes(currentStatus);

  const showOriginHubDetails =
    isPickupJourney &&
    [
      "Pickup Completed",
      "Arrived At Origin Hub",
      "Sorting Completed",
    ].includes(currentStatus);

  const showDestinationHubDetails =
    isDeliveryJourney &&
    ["Arrived At Destination Hub", "Delivery Agent Assigned"].includes(
      currentStatus
    );

  const showReceiverDetails =
    isDeliveryJourney && currentStatus === "Out For Delivery";

  const timeline = useMemo(() => {
    if (!order) {
      return [];
    }

    const statuses = isDeliveryJourney
      ? DELIVERY_STATUSES
      : PICKUP_STATUSES;

    return statuses.map((status) => {
      const history = order.journeyHistory.find(
        (item) => item.status === status
      );

      return {
        label:
          status === "Arrived At Origin Hub" ? "Completed" : status,
        date: history?.eventAt,
        description: history?.remarks,
      };
    });
  }, [order, isDeliveryJourney]);

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateShipmentStatus();

  const handleStatusChange = (value: string) => {
    if (!order?.shipmentId) {
      return;
    }

    const status = value as OrderStatus;
    const config = STATUS_CONFIG[status];

    if (!config) {
      return;
    }

    updateStatus(
      {
        shipmentId: order.shipmentId,
        payload: {
          status,
          event: config.event,
          remarks: config.remarks,
          agentId,
          updatedBy: agentId,
        },
      },
      {
        onSuccess: () => {
          setCurrentStatus(status);
        },
      }
    );
  };

  const handleConfirmDelivery = () => {
    setIsDeliveryConfirmationOpen(false);
    handleStatusChange("Delivered");
  };

  const goToVerification = () => {
    window.history.pushState(
      {},
      "",
      `/agent/pickup-orders/${shipmentId}/pickup-verification`
    );

    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (isLoading) {
    return <Rb_LoadingSpinner />;
  }

  if (isError || !order || !shipmentId) {
    return (
      <div>
        <Rb_Text className="text-xl font-semibold text-gray-900">
          Couldn't load order
        </Rb_Text>

        <Rb_Text className="mt-2 text-sm text-gray-500">
          We couldn't load this order's details right now. Check your
          connection and try again.
        </Rb_Text>

        <Rb_Button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="mt-6"
        >
          <FiRefreshCw className={isRefetching ? "animate-spin" : ""} />
          {isRefetching ? "Retrying..." : "Try again"}
        </Rb_Button>
      </div>
    );
  }

  return (
    <div className="w-full mt-7">
      <PageHeader
        title={pageTitle}
        orderNumber={order.orderNumber}
        currentStatus={currentStatus}
        deliveryType={order.deliveryType}
        onStatusChange={handleStatusChange}
        disabled={isUpdatingStatus}
      />

      <div className="mt-6 grid w-full min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* LEFT */}
        <div className="min-w-0 space-y-6">
          <BookDetails item={order.items[0]} />

          {showSellerDetails && seller && (
            <DetailsBlock
              contactTitle="Pickup Contact"
              name={seller.name}
              phone={seller.phoneNumber}
              onCall={() => callPhone(seller.phoneNumber)}
              locationTitle="Pickup Location"
              locationSubtitle="Seller pickup address"
              address={seller.address.street}
              city={`${seller.address.city}, ${seller.address.state}`}
              zipCode={seller.address.zipCode}
              onMap={() => openMaps(seller.address.location)}
            />
          )}

          {showOriginHubDetails && originHub && (
            <DetailsBlock
              contactTitle="Hub Contact"
              name={originHub.name}
              phone={originHub.phoneNumber}
              onCall={
                originHub.phoneNumber
                  ? () => callPhone(originHub.phoneNumber)
                  : undefined
              }
              locationTitle="Origin Hub"
              locationSubtitle="Submit book to hub"
              address={originHub.address}
              city={`${originHub.city}, ${originHub.state}`}
              zipCode={originHub.pincode}
            />
          )}

          {showDestinationHubDetails && destinationHub && (
            <DetailsBlock
              contactTitle="Destination Hub Contact"
              name={destinationHub.name}
              phone={destinationHub.phoneNumber}
              onCall={
                destinationHub.phoneNumber
                  ? () => callPhone(destinationHub.phoneNumber)
                  : undefined
              }
              locationTitle="Destination Hub"
              locationSubtitle="Delivery agent pickup point"
              address={destinationHub.address}
              city={`${destinationHub.city}, ${destinationHub.state}`}
              zipCode={destinationHub.pincode}
            />
          )}

          {showReceiverDetails && user && (
            <DetailsBlock
              contactTitle="Delivery Contact"
              name={user.name}
              phone={user.phoneNumber}
              onCall={() => callPhone(user.phoneNumber)}
              locationTitle="Delivery Location"
              locationSubtitle="Customer address"
              address={user.address.street}
              city={`${user.address.city}, ${user.address.state}`}
              zipCode={user.address.zipCode}
              onMap={() => openMaps(user.address.location)}
            />
          )}
        </div>

        {/* RIGHT */}
        <div className="min-w-0 space-y-6 xl:sticky xl:top-5">
          <ProgressTimeline
            timeline={timeline}
            currentStatus={currentStatus}
          />

          <ActionCard
            status={currentStatus}
            onVerify={goToVerification}
            onSorting={() => handleStatusChange("Sorting Completed")}
            onDelivered={() => setIsDeliveryConfirmationOpen(true)}
          />
        </div>
      </div>

      {isUpdatingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
          <Rb_LoadingSpinner />
        </div>
      )}
      <ConfirmationModal
        isOpen={isDeliveryConfirmationOpen}
        title="Mark Order as Delivered"
        message="Are you sure you want to mark this order as delivered?"
        confirmLabel="Mark Delivered"
        onClose={() => setIsDeliveryConfirmationOpen(false)}
        onConfirm={handleConfirmDelivery}
      />
    </div>
  );
};

export default AgentPickDetails;