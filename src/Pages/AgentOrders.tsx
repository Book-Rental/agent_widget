
import { useState } from "react";
import {
  Pagination,
  Rb_Button,
  Rb_LoadingSpinner,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

import { useAgentOrders } from "../hooks/useAgentOrders";
import { EmptyOrdersState } from "../components/orderDetails/EmptyState";
import { AgentOrderCard } from "../components/orderDetails/Agentordercard";
import { OrderStatusControl } from "../components/orderDetails/Orderstatuscontrol";
import {
  DROPDOWN_CONFIGS,
  STATUS_META,
} from "../components/orderDetails/Agentorderstatusdisplay";
import { AgentOrderLocation } from "../components/orderDetails/Agentorderlocation";
import { AgentOrderTabs } from "../components/orderDetails/Agentordertabs";
import { useAgentStatusChange } from "../hooks/Useagentstatuschange";

import type { OrderStatus } from "../Types/AgentTypes";

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "Pickup Assigned", label: "Pickup Assigned" },
  { key: "Out For Pickup", label: "Out For Pickup" },
  { key: "Pickup Completed", label: "Pickup Completed" },
  { key: "Arrived At Origin Hub", label: "Completed" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const EMPTY_STATE_COPY: Partial<Record<TabKey, string>> = {
  all: "You don't have any assigned orders right now. New assignments will show up here.",
  "Pickup Assigned": "No pickups have been assigned to you yet.",
  "Out For Pickup": "Nothing is currently out for pickup.",
  "Pickup Completed": "No completed pickups to show yet.",
  "Arrived At Origin Hub": "No orders have finished sorting yet.",
};

const navigateTo = (path: string) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const AgentOrders = () => {
  const agentId = window.HOST_USER_INFO?.referenceId ?? "";

  const {
    onStatusChange,
    isUpdatingStatus,
  } = useAgentStatusChange(agentId);

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const currentStatus: OrderStatus | undefined =
    activeTab === "all" ? undefined : activeTab;

  const {
    data,
    isPending,
    isError,
  } = useAgentOrders(
    agentId,
    "Pickup",
    currentPage,
    currentStatus
  );

  const orders = data?.orders ?? [];
  const meta = data?.meta;
  const counts = data?.counts;

  /**
   * Tab counts come directly from the API response.
   */
  const tabCounts: Record<TabKey, number> = {
    all: counts?.totalCount ?? 0,
    "Pickup Assigned":
      counts?.["Pickup Assigned"] ?? 0,
    "Out For Pickup":
      counts?.["Out For Pickup"] ?? 0,
    "Pickup Completed":
      counts?.["Pickup Completed"] ?? 0,
    "Arrived At Origin Hub":
      counts?.["Arrived At Origin Hub"] ?? 0,
  };

  const handleTabChange = (tab: TabKey) => {
    if (tab === activeTab) {
      return;
    }

    setActiveTab(tab);
    setCurrentPage(1);
  };

  if (isPending) {
    return <Rb_LoadingSpinner />;
  }

  if (isError) {
    console.log("error", isError);

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
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
        >
          Try Again
        </Rb_Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl px-2 pt-1 pb-6 sm:px-4 sm:pt-4 lg:px-6 lg:pt-0">
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-900">
          Pick Up Orders
        </h4>

        <p className="mt-1 text-sm text-gray-500">
          Manage and track your assigned pickup orders
        </p>
      </div>

      <div className="mb-6">
        <AgentOrderTabs
          tabs={TABS}
          activeTab={activeTab}
          counts={tabCounts}
          onChange={handleTabChange}
        />
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <EmptyOrdersState
            message={
              EMPTY_STATE_COPY[activeTab] ??
              "No orders in this category yet."
            }
          />
        ) : (
          orders.map((order) => (
            <AgentOrderCard
              key={order.shipmentId}
              order={order}
              statusSlot={
                <OrderStatusControl
                  order={order}
                  statusMeta={STATUS_META}
                  dropdownConfigs={DROPDOWN_CONFIGS}
                  onStatusChange={(order, status) => {
                    setUpdatingOrderId(order.shipmentId);
                    onStatusChange(order, status);
                  }}
                  disabled={
                    isUpdatingStatus &&
                    updatingOrderId === order.shipmentId
                  }
                />
              }
              locationSlot={
                <AgentOrderLocation order={order} />
              }
              onViewDetails={(order) =>
                navigateTo(
                  `/agent/pickup-orders/${order.shipmentId}`
                )
              }
            />
          ))
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
  );
};

export default AgentOrders;
