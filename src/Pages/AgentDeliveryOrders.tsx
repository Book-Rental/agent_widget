
//adding modal
import { useState } from "react";
import { Pagination, Rb_Button, Rb_LoadingSpinner, Rb_Text, Checkbox } from "@rentbook/rentbook-ui-lib";
import { useAgentOrders } from "../hooks/useAgentOrders";
import { useAgentStatusChange } from "../hooks/Useagentstatuschange";
import { AgentOrderCard } from "../components/orderDetails/Agentordercard";
import { OrderStatusControl } from "../components/orderDetails/Orderstatuscontrol";
import { DROPDOWN_CONFIGS, STATUS_META } from "../components/orderDetails/Agentorderstatusdisplay";
import { AgentOrderLocation } from "../components/orderDetails/Agentorderlocation";
import { EmptyOrdersState } from "../components/orderDetails/EmptyState";
import { AgentOrderTabs } from "../components/orderDetails/Agentordertabs";
import { FiAlertCircle } from "react-icons/fi";
import type { OrderStatus } from "../Types/AgentTypes";
import { useAgentOrderCounts } from "../hooks/useAgentOrderCounts";
import { DeliveryConfirmationModal } from "../components/orderDetails/DeliveryConfirmationModal";

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "Delivery Agent Assigned", label: "Delivery Assigned" },
  { key: "Out For Delivery", label: "Out For Delivery" },
  { key: "Delivered", label: "Delivered" },
] as const;

const EMPTY_STATE_COPY: Partial<Record<(typeof TABS)[number]["key"], string>> = {
  all: "You don't have any delivery orders right now. New assignments will show up here.",
  "Delivery Agent Assigned": "No deliveries have been assigned to you yet.",
  "Out For Delivery": "Nothing is currently out for delivery.",
  Delivered: "You haven't delivered any orders yet.",
};

const navigateTo = (path: string) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const STATUS_TABS = TABS.slice(1).map((t) => t.key as OrderStatus);
const SELECTABLE_STATUS: OrderStatus = "Delivery Agent Assigned";

const AgentDeliveryOrders = () => {
  const agentId = window.HOST_USER_INFO?.referenceId ?? "";
  const { onStatusChange, isUpdatingStatus } = useAgentStatusChange(agentId);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmAction, setConfirmAction] = useState<"accept" | "reject" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  console.log(isProcessing)

  const currentStatus = activeTab === "all" ? undefined : (activeTab as OrderStatus);

  const { data, isPending, isError } = useAgentOrders(agentId, "Delivery", currentPage, currentStatus);
  const orders = data?.orders ?? [];
  const meta = data?.meta;
  

  const counts = useAgentOrderCounts(agentId, "Delivery", STATUS_TABS);

  const handleTabChange = (tab: (typeof TABS)[number]["key"]) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const toggleSelect = (shipmentId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(shipmentId)) next.delete(shipmentId);
      else next.add(shipmentId);
      return next;
    });
  };

  const selectedOrders = orders.filter(
    (o) => o.shipmentId && selectedIds.has(o.shipmentId)
  );
  const hasSelection = selectedOrders.length > 0;

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setIsProcessing(true);
    try {
      const newStatus: OrderStatus =
        confirmAction === "accept" ? "Out For Delivery" : "Delivery Failed";

      await Promise.all(
        selectedOrders
          .filter((o): o is typeof o & { shipmentId: string } => !!o.shipmentId)
    .map((o) => onStatusChange(o, newStatus))
      );

      setSelectedIds(new Set());
      setConfirmAction(null);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPending) return <Rb_LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <FiAlertCircle className="text-3xl text-red-500" />
          </div>
          <Rb_Text className="text-xl font-semibold text-gray-900">Oops! Something went wrong</Rb_Text>
          <Rb_Text className="mt-2 text-sm text-gray-500">
            We couldn't load your order details right now. Please try again in a few moments.
          </Rb_Text>
          <Rb_Button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Try Again
          </Rb_Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isUpdatingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <Rb_LoadingSpinner />
            <Rb_Text className="mt-3 text-sm text-gray-600">Updating status...</Rb_Text>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl px-4 py-6">
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-900">Delivery Orders</h4>
          <p className="mt-1 text-sm text-gray-500">Manage and track your assigned delivery orders</p>
        </div>

        <div className="mb-6 flex flex-wrap items-stretch justify-between gap-3">
          <AgentOrderTabs tabs={TABS} activeTab={activeTab} counts={counts} onChange={handleTabChange} />

          <div className="flex items-stretch gap-2">
             <Rb_Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!hasSelection}
                onClick={() => setConfirmAction("reject")}
                className="!h-9 !px-3 !py-0 !text-xs sm:!text-sm !border-red-200 !text-red-600 hover:!bg-red-50"
              >
                Reject{hasSelection ? ` (${selectedOrders.length})` : ""}
              </Rb_Button>

              <Rb_Button
                type="button"
                variant="primary"
                size="sm"
                disabled={!hasSelection}
                onClick={() => setConfirmAction("accept")}
                className="!h-9 !px-3 !py-0 !text-xs sm:!text-sm"
              >
                Accept{hasSelection ? ` (${selectedOrders.length})` : ""}
              </Rb_Button>
          </div>
        </div>

        <div className="space-y-3">
          {orders.length === 0 ? (
            <EmptyOrdersState message={EMPTY_STATE_COPY[activeTab] ?? "No orders in this category yet."} />
          ) : (
            orders.map((order) => (
              <AgentOrderCard
                key={order.orderId}
                order={order}
                selectionSlot={
                  order.shipmentId && order.orderStatus === SELECTABLE_STATUS ? (
                    <Checkbox
                      checked={selectedIds.has(order.shipmentId)}
                      onChange={() => toggleSelect(order.shipmentId!)}
                      disabled={isUpdatingStatus}
                    />
                  ) : null
                }
                statusSlot={
                  <OrderStatusControl
                    order={order}
                    statusMeta={STATUS_META}
                    dropdownConfigs={DROPDOWN_CONFIGS}
                    onStatusChange={onStatusChange}
                    disabled={isUpdatingStatus}
                  />
                }
                locationSlot={<AgentOrderLocation order={order} />}
                // onViewDetails={(o) => navigateTo(`/agent-orders/${o.shipmentId}`)}
                onViewDetails={(o) => navigateTo(`/agent/delivery-orders/${o.shipmentId}`)}
              />
            ))
          )}
        </div>

        {meta && meta.totalRecords > meta.limit && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
              disabled={isPending}
            />
          </div>
        )}
      </div>
      <DeliveryConfirmationModal
        isOpen={confirmAction !== null}
        action={confirmAction ?? "accept"}
        selectedCount={selectedOrders.length}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default AgentDeliveryOrders;