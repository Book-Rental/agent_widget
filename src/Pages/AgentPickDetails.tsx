import { useEffect, useMemo, useState } from "react";
import type { OrderStatus } from "../Types/AgentTypes";
import { useAgentOrderDetails } from "../hooks/useAgentOrderDetails";
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
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { Rb_Text } from "@rentbook/rentbook-ui-lib";
// import StatusNoteCard from "../components/pickDetails/StatusNoteCard";

type AgentPickDetailsProps = {
  shipmentId: string;
};

const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-gray-100 ${className}`} />
);

const AgentPickDetailsSkeleton = () => (
  <div className="min-h-screen px-4 py-4">
    <div className="mx-auto max-w-6xl space-y-4">
      <Shimmer className="h-20 w-full rounded-2xl" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_340px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex gap-4">
              <Shimmer className="h-24 w-16 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <Shimmer className="h-5 w-2/3" />
                <Shimmer className="h-4 w-1/3" />
                <Shimmer className="h-4 w-16" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Shimmer className="h-3 w-28" />
            <div className="grid gap-4 md:grid-cols-2">
              <Shimmer className="h-32" />
              <Shimmer className="h-32" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Shimmer className="h-56 rounded-2xl" />
          <Shimmer className="h-28 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

const AgentPickDetails = ({ shipmentId }: AgentPickDetailsProps) => {
  const { data: order, isLoading, isError, refetch, isRefetching } =
    useAgentOrderDetails(shipmentId);
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
    isSellerToHub && ["Pickup Assigned", "Out For Pickup"].includes(currentStatus);

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
      order.deliveryType === "SELLER_TO_HUB" ? sellerTimeline : deliveryTimeline;

    return statuses.map((status) => {
      const history = order.journeyHistory.find((item) => item.status === status);

      return {
        label: status === "Arrived At Origin Hub" ? "Completed" : status,
        date: history?.eventAt,
        description: history?.remarks,
      };
    });
  }, [order]);

const {
  mutate: updateStatus,
  isPending: isUpdatingStatus,
} = useUpdateShipmentStatus(); const agentId = window.HOST_USER_INFO?.referenceId ?? "";

  const handleStatusChange = (value: string) => {
    if (!order) return;
    const status = value as OrderStatus;

    updateStatus(
      {
        shipmentId: order.shipmentId!,
        payload: {
          status,
          event: STATUS_CONFIG[status]!.event,
          remarks: STATUS_CONFIG[status]!.remarks,
          agentId,
          updatedBy: agentId,
        },
      },
      {
        onSuccess() {
          setCurrentStatus(status);
        },
      }
    );
  };

  const goToVerification = () => {
    if (!order) return;
    window.history.pushState(
      {},
      "",
      `/agent/pickup-orders/${shipmentId}/pickup-verification`
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (isLoading) {
    return <AgentPickDetailsSkeleton />;
  }

  if (isError || !order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <FiAlertCircle className="text-3xl text-red-500" />
          </div>

          <Rb_Text className="text-xl font-semibold text-gray-900">
            Couldn't load order
          </Rb_Text>

          <Rb_Text className="mt-2 text-sm text-gray-500">
            We couldn't load this order's details right now. Check your connection
            and try again.
          </Rb_Text>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw className={isRefetching ? "animate-spin" : ""} />
            {isRefetching ? "Retrying…" : "Try again"}
          </button>
        </div>
      </div>
    );
  }

  const contactLabel = isHubToUser ? "Delivery Contact" : "Pickup Contact";

  return (
    <>
     {/* {isUpdatingStatus && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <Rb_LoadingSpinner />
    </div>
  </div>
)} */}
    <div className="min-h-screen px-4 py-5">
      <div className="mx-auto max-w-7xl space-y-6">
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
   disabled={isUpdatingStatus}
/>

        <div className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="space-y-6">
            <BookDetails item={order.items[0]} />

            {(showSellerDetails || showHubDetails || isHubToUser) && (
              <div className="grid items-stretch gap-6 md:grid-cols-2">
                {showSellerDetails && seller && (
                  <>
                    <ContactCard
                      title={contactLabel}
                      name={seller.name}
                      phone={seller.phoneNumber}
                      onCall={() => callPhone(seller.phoneNumber)}
                    />

                    {seller.address && (
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
                  </>
                )}

                {showHubDetails && hub && (
                  <>
                    <ContactCard title="Hub Contact" name={hub.name} onCall={() => {}} />

                    <LocationCard
                      title="Hub Details"
                      subtitle="Submit book to hub"
                      name={hub.name}
                      address={hub.address}
                      city={`${hub.city}, ${hub.state}`}
                      onMap={() => {}}
                    />
                  </>
                )}

                {isHubToUser && user && (
                  <>
                    <ContactCard
                      title={contactLabel}
                      name={user.name}
                      phone={user.phoneNumber}
                      onCall={() => callPhone(user.phoneNumber)}
                    />

                    {user.address && (
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
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6 xl:sticky xl:top-5">
            {/* <StatusNoteCard status={currentStatus} /> */}
            <ProgressTimeline timeline={timeline} />
            <ActionCard
              status={currentStatus}
              onVerify={goToVerification}
              onSorting={() => handleStatusChange("Sorting Completed")}
              onDelivered={() => handleStatusChange("Delivered")}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AgentPickDetails;