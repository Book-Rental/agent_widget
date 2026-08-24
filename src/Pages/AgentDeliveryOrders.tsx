import { useState } from "react";
import {
  Pagination,
  Rb_Button,
  Rb_LoadingSpinner,
  Rb_Text,
  Checkbox,
} from "@rentbook/rentbook-ui-lib";

import { useAgentOrders } from "../hooks/useAgentOrders";
import { useAgentStatusChange } from "../hooks/Useagentstatuschange";
import { AgentOrderCard } from "../components/orderDetails/Agentordercard";
import { STATUS_META } from "../components/orderDetails/Agentorderstatusdisplay";
import { EmptyOrdersState } from "../components/orderDetails/EmptyState";
import { AgentOrderTabs } from "../components/orderDetails/Agentordertabs";
import { AgentOrderLocation } from "../components/orderDetails/Agentorderlocation";
import type { OrderStatus } from "../Types/AgentTypes";
import { ConfirmationModal } from "../components/orderDetails/ConfirmationModal";

const TABS = [
  {
    key: "all",
    label: "All Orders",
  },
  {
    key: "Delivery Agent Assigned",
    label: "Delivery Assigned",
  },
  {
    key: "Out For Delivery",
    label: "Out For Delivery",
  },
  {
    key: "Delivered",
    label: "Delivered",
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const EMPTY_STATE_COPY: Partial<Record<TabKey, string>> = {
  all: "You don't have any delivery orders right now. New assignments will show up here.",
  "Delivery Agent Assigned":
    "No deliveries have been assigned to you yet.",
  "Out For Delivery":
    "Nothing is currently out for delivery.",
  Delivered:
    "You haven't delivered any orders yet.",
};

const SELECTABLE_STATUS: OrderStatus = "Delivery Agent Assigned";

const navigateTo = (path: string) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const AgentDeliveryOrders = () => {
  const agentId = window.HOST_USER_INFO?.referenceId ?? "";

  const [activeTab, setActiveTab] =
    useState<TabKey>("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedIds, setSelectedIds] =
    useState<Set<string>>(new Set());

  // const [tabCounts, setTabCounts] =
  //   useState<Partial<Record<TabKey, number>>>({});

  const [confirmAction, setConfirmAction] =
    useState<"accept" | "reject" | null>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const {
    // onStatusChange,
    isUpdatingStatus,
    onBulkStatusChange,
    isBulkUpdating,
  } = useAgentStatusChange(agentId);

  const currentStatus: OrderStatus | undefined =
    activeTab === "all"
      ? undefined
      : activeTab;

  const {
    data,
    isPending,
    isError,
  } = useAgentOrders(
    agentId,
    "Delivery",
    currentPage,
    currentStatus
  );

  const orders = data?.orders ?? [];
  const meta = data?.meta;
const counts = data?.counts;
  console.log("orders",data,orders,meta,counts)
  // useEffect(() => {
  //   if (!meta) {
  //     return;
  //   }

  //   setTabCounts((previous) => {
  //     if (
  //       previous[activeTab] ===
  //       meta.totalRecords
  //     ) {
  //       return previous;
  //     }

  //     return {
  //       ...previous,
  //       [activeTab]: meta.totalRecords,
  //     };
  //   });
  // }, [meta, activeTab]);
const tabCounts: Record<TabKey, number> = {
  all: counts?.totalCount ?? 0,
  "Delivery Agent Assigned":
    counts?.["Delivery Agent Assigned"] ?? 0,
  "Out For Delivery":
    counts?.["Out For Delivery"] ?? 0,
  Delivered: counts?.Delivered ?? 0,
};
  const handleTabChange = (tab: TabKey) => {
    if (tab === activeTab) {
      return;
    }

    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const toggleSelect = (shipmentId: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);

      if (next.has(shipmentId)) {
        next.delete(shipmentId);
      } else {
        next.add(shipmentId);
      }

      return next;
    });
  };

  const selectedOrders = orders.filter(
    (order) =>
      !!order.shipmentId &&
      selectedIds.has(order.shipmentId)
  );

  const handleConfirm = async () => {
    if (!confirmAction) {
      return;
    }

    const newStatus: OrderStatus = confirmAction === "accept" ? "Out For Delivery" : "Delivery Failed";

    const shipmentIds = selectedOrders
    .map((order) => order.shipmentId)
    .filter((id): id is string => !!id);

    setConfirmAction(null);
    setIsProcessing(true);
    try {
      await onBulkStatusChange(shipmentIds, newStatus);
      setSelectedIds(new Set());
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPending) {
    return <Rb_LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <Rb_Text className="text-xl font-semibold text-gray-900">
          Oops! Something went wrong
        </Rb_Text>

        <Rb_Text className="mt-2 text-sm text-gray-500">
          We couldn't load your order details right now.
          Please try again in a few moments.
        </Rb_Text>

        <Rb_Button
          onClick={() =>
            window.location.reload()
          }
          className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
        >
          Try Again
        </Rb_Button>
      </div>
    );
  }

  return (
    <>
      {isUpdatingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
          <div className="flex flex-col items-center">
            <Rb_LoadingSpinner />

            <Rb_Text className="mt-3 text-sm text-gray-600">
              Updating status...
            </Rb_Text>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl px-2 pt-1 pb-6 sm:px-4 sm:pt-4 lg:px-6 lg:pt-0">
        {/* Header */}
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-900">
            Delivery Orders
          </h4>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track your assigned delivery orders
          </p>
        </div>

        {/* Tabs + Actions */}
        <div className="mb-6 flex flex-wrap items-stretch justify-between gap-3">
          <AgentOrderTabs
            tabs={TABS}
            activeTab={activeTab}
            counts={tabCounts}
            onChange={handleTabChange}
          />

            <div className="flex items-stretch gap-2">
              <Rb_Button
                type="button"
                variant="outline"
                size="sm"
                disabled={
                  selectedOrders.length === 0 ||
                  isProcessing ||
                  isUpdatingStatus ||
                  isBulkUpdating
                }
                onClick={() =>
                  setConfirmAction("reject")
                }
                className="!h-9 !border-red-200 !px-3 !py-0 !text-xs !text-red-600 hover:!bg-red-50 sm:!text-sm"
              >
                Reject ({selectedOrders.length})
              </Rb_Button>

              <Rb_Button
                type="button"
                variant="primary"
                size="sm"
                disabled={
                  selectedOrders.length === 0 ||
                  isProcessing ||
                  isUpdatingStatus ||
                  isBulkUpdating
                }
                onClick={() =>
                  setConfirmAction("accept")
                }
                className="!h-9 !px-3 !py-0 !text-xs sm:!text-sm"
              >
                Accept ({selectedOrders.length})
              </Rb_Button>
            </div>

        </div>

        {/* Orders */}
        <div className="space-y-3">
          {orders.length === 0 ? (
            <EmptyOrdersState
              message={
                EMPTY_STATE_COPY[activeTab] ??
                "No orders in this category yet."
              }
            />
          ) : (
            orders.map((order) => {
              const statusMeta =
                STATUS_META[
                order.orderStatus
                ];

              const shipmentId =
                order.shipmentId;

              if (!shipmentId) {
                return null;
              }

              return (
                <AgentOrderCard
                  key={shipmentId}
                  order={order}
                  selectionSlot={
                    order.orderStatus ===
                      SELECTABLE_STATUS ? (
                      <Checkbox
                        checked={selectedIds.has(
                          shipmentId
                        )}
                        onChange={() =>
                          toggleSelect(
                            shipmentId
                          )
                        }
                        disabled={
                          isUpdatingStatus ||
                          isProcessing
                        }
                      />
                    ) : null
                  }
                  statusSlot={
                    statusMeta ? (
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusMeta.badge}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`}
                        />

                        {statusMeta.label}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">
                        {order.orderStatus}
                      </span>
                    )
                  }
                  locationSlot={
                    <AgentOrderLocation
                      order={order}
                    />
                  }
                  onViewDetails={() =>
                    navigateTo(
                      `/agent/delivery-orders/${shipmentId}`
                    )
                  }
                />
              );
            })
          )}
        </div>

        {meta && meta.totalPages > 1 && (
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

      <ConfirmationModal
        isOpen={confirmAction !== null}
        title={
          confirmAction === "accept"
            ? "Accept Deliveries"
            : "Reject Deliveries"
        }
        message={
          confirmAction === "accept"
            ? `Are you sure you want to accept ${selectedOrders.length
            } selected delivery order${selectedOrders.length > 1 ? "s" : ""
            }?`
            : `Are you sure you want to reject ${selectedOrders.length
            } selected delivery order${selectedOrders.length > 1 ? "s" : ""
            }?`
        }
        confirmLabel={
          confirmAction === "accept" ? "Accept" : "Reject"
        }
        onClose={() =>
          setConfirmAction(null)
        }
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default AgentDeliveryOrders;

