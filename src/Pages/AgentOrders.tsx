import { useMemo, useState } from "react";
import { Rb_Button, Rb_LoadingSpinner, Rb_Text } from "@rentbook/rentbook-ui-lib";
import { useAgentOrders } from "../hooks/useAgentOrders";
import { EmptyOrdersState } from "../components/orderDetails/EmptyState";
import { AgentOrderCard } from "../components/orderDetails/Agentordercard";
import { OrderStatusControl } from "../components/orderDetails/Orderstatuscontrol";
import { DROPDOWN_CONFIGS, STATUS_META } from "../components/orderDetails/Agentorderstatusdisplay";
import { AgentOrderLocation } from "../components/orderDetails/Agentorderlocation";
import { AgentOrderTabs } from "../components/orderDetails/Agentordertabs";
import { useAgentStatusChange } from "../hooks/Useagentstatuschange";
import { FiAlertCircle } from "react-icons/fi";

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "Pickup Assigned", label: "Pickup Assigned" },
  { key: "Out For Pickup", label: "Out For Pickup" },
  { key: "Pickup Completed", label: "Pickup Completed" },
  { key: "Arrived At Origin Hub", label: "Completed" },
] as const;

const EMPTY_STATE_COPY: Partial<Record<(typeof TABS)[number]["key"], string>> = {
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
  // const agentId = "6a6b29dbf447531ecb351110";
  const agentId = window.HOST_USER_INFO?.referenceId ?? "";
  const changeStatus = useAgentStatusChange(agentId);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("all");
  const { data: orders = [], isPending, isError } = useAgentOrders(agentId);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: orders.length };
    orders.forEach((order) => {
      result[order.orderStatus] = (result[order.orderStatus] || 0) + 1;
    });
    return result;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((order) => order.orderStatus === activeTab);
  }, [activeTab, orders]);

  if (isPending) {
    return <Rb_LoadingSpinner />;
  }

  if (isError) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
  <FiAlertCircle className="text-3xl text-red-500" />
</div>
        </div>

        <Rb_Text className="text-xl font-semibold text-gray-900">
          Oops! Something went wrong
        </Rb_Text>

        <Rb_Text className="mt-2 text-sm text-gray-500">
          We couldn't load your order details right now. Please try again in a
          few moments.
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
    <div className="w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-900">Pick Up Orders</h4>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track your assigned pickup orders
        </p>
      </div>

      {orders.length > 0 && (
        <AgentOrderTabs
          tabs={TABS}
          activeTab={activeTab}
          counts={counts}
          onChange={setActiveTab}
        />
      )}

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <EmptyOrdersState
            message={
              EMPTY_STATE_COPY[activeTab] ??
              "No orders in this category yet."
            }
          />
        ) : (
          filteredOrders.map((order) => (
            <AgentOrderCard
              key={order.orderId}
              order={order}
              statusSlot={
                <OrderStatusControl
                  order={order}
                  statusMeta={STATUS_META}
                  dropdownConfigs={DROPDOWN_CONFIGS}
                  onStatusChange={changeStatus}
                />
              }
              locationSlot={<AgentOrderLocation order={order} />}
              onViewDetails={(o) =>
                navigateTo(`/agent/pickup-orders/${o.shipmentId}`)
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AgentOrders;