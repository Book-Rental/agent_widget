import { useMemo, useState } from "react";
import {
  Dropdown,
  Rb_Button,
  Rb_Image,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";
import type { AgentOrder, OrderStatus } from "../Types/AgentTypes";
import { useAgentOrders } from "../hooks/useAgentOrders";
// import { AgentOrderDetailsMock } from "../mock/AgentOrderDetails";

const STATUS_META: Partial<
  Record<
    OrderStatus,
    {
      label: string;
      badge: string;
      dot: string;
    }
  >
> = {
  "Ready For Pickup": {
    label: "Ready For Pickup",
    badge: "bg-gray-50 text-gray-700",
    dot: "bg-gray-500",
  },
  "Pickup Assigned": {
    label: "Pickup Assigned",
    badge: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  "Out For Pickup": {
    label: "Out For Pickup",
    badge: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  "Pickup Completed": {
    label: "Pickup Completed",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  "Sorting Completed": {
    label: "Completed",
    badge: "bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
  },
  // "Delivery Agent Assigned": {
  //   label: "Delivery Assigned",
  //   badge: "bg-violet-50 text-violet-700",
  //   dot: "bg-violet-500",
  // },
  // "Out For Delivery": {
  //   label: "Out For Delivery",
  //   badge: "bg-blue-50 text-blue-700",
  //   dot: "bg-blue-500",
  // },
  // Delivered: {
  //   label: "Delivered",
  //   badge: "bg-emerald-50 text-emerald-700",
  //   dot: "bg-emerald-500",
  // },
};

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "Pickup Assigned", label: "Pickup Assigned" },
  { key: "Out For Pickup", label: "Out For Pickup" },
  { key: "Pickup Completed", label: "Pickup Completed" },
  { key: "Sorting Completed", label: "Completed" },
  // { key: "Delivery Agent Assigned", label: "Delivery Assigned" },
  // { key: "Out For Delivery", label: "Out For Delivery" },
  // { key: "Delivered", label: "Delivered" },
] as const;

const EMPTY_STATE_COPY: Partial<Record<(typeof TABS)[number]["key"], string>> = {
  all: "You don't have any assigned orders right now. New assignments will show up here.",
  "Pickup Assigned": "No pickups have been assigned to you yet.",
  "Out For Pickup": "Nothing is currently out for pickup.",
  "Pickup Completed": "No completed pickups to show yet.",
  "Sorting Completed": "No orders have finished sorting yet.",
  // "Delivery Agent Assigned": "No deliveries have been assigned to you yet.",
  // "Out For Delivery": "Nothing is currently out for delivery.",
  // Delivered: "You haven't delivered any orders yet.",
};

const formatDate = (date?: string) => {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getOrderNumber = (order: AgentOrder) =>
  order.orderNumber?.replace(/^ORD/, "").slice(-6) ?? "";

// ---- Presentational helpers -------------------------------------------------

// const OrdersSkeleton = () => (
//   <div className="space-y-3" aria-hidden="true">
//     {[0, 1, 2].map((i) => (
//       <div
//         key={i}
//         className="animate-pulse rounded-xl border border-gray-200 bg-white p-4"
//       >
//         <div className="flex gap-4">
//           <div className="h-20 w-16 shrink-0 rounded-lg bg-gray-200" />
//           <div className="flex-1 space-y-2 py-1">
//             <div className="h-3.5 w-1/3 rounded bg-gray-200" />
//             <div className="h-3 w-1/2 rounded bg-gray-100" />
//             <div className="h-3 w-2/5 rounded bg-gray-100" />
//           </div>
//           <div className="h-6 w-24 shrink-0 rounded-full bg-gray-200" />
//         </div>
//       </div>
//     ))}
//   </div>
// );

// const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
//   <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50/60 px-6 py-12 text-center">
//     <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
//       <svg
//         className="h-5 w-5 text-red-600"
//         fill="none"
//         viewBox="0 0 24 24"
//         strokeWidth={2}
//         stroke="currentColor"
//         aria-hidden="true"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M12 9v3.75m9-1.5a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
//         />
//       </svg>
//     </div>
//     <div>
//       <Rb_Text className="text-sm font-semibold text-gray-900">
//         We couldn't load your orders
//       </Rb_Text>
//       <Rb_Text className="mt-1 text-sm text-gray-500">
//         Check your connection and try again.
//       </Rb_Text>
//     </div>
//     <Rb_Button variant="primary" onClick={onRetry}>
//       Try again
//     </Rb_Button>
//   </div>
//);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-12 text-center">
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
      <svg
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    </div>
    <Rb_Text className="max-w-xs text-sm text-gray-500">{message}</Rb_Text>
  </div>
);

// ---- Main component ----------------------------------------------------------

const AgentOrders = () => {
  const agentId = "6a6b10202eb459f877594bb0";
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["key"]>("all");

  const {
    data: orders = [],
    isPending,
    isError,
  } = useAgentOrders(agentId);
// const orders: AgentOrder[] = AgentOrderDetailsMock;
// const isPending = false;
// const isError = false;
  const counts = useMemo(() => {
    const result: Record<string, number> = {
      all: orders.length,
    };

    orders.forEach((order) => {
      result[order.orderStatus] = (result[order.orderStatus] || 0) + 1;
    });

    return result;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((order) => order.orderStatus === activeTab);
  }, [activeTab, orders]);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    // TODO: wire up to the actual status-update mutation
    console.log("Order:", orderId, "New status:", status);
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const renderLocation = (order: AgentOrder) => {
    if (
      order.deliveryType === "SELLER_TO_HUB" &&
      order.sellerDetails &&
      (order.orderStatus === "Pickup Assigned" ||
        order.orderStatus === "Out For Pickup")
    ) {
      const address = order.sellerDetails.address;

      return (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          <div className="min-w-0">
            <Rb_Text className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Pickup location
            </Rb_Text>
            <Rb_Text className="text-sm text-gray-700">
              {address.street}, {address.city}, {address.state}
            </Rb_Text>
            <Rb_Text className="text-xs text-gray-400">
              {address.zipCode}
            </Rb_Text>
          </div>
        </div>
      );
    }

    if (
      order.deliveryType === "SELLER_TO_HUB" &&
      order.hubDetails &&
      (order.orderStatus === "Pickup Completed" ||
        order.orderStatus === "Arrived At Origin Hub" ||
        order.orderStatus === "Sorting Completed")
    ) {
      return (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          <div className="min-w-0">
            <Rb_Text className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Hub
            </Rb_Text>
            <Rb_Text className="text-sm font-medium text-gray-800">
              {order.hubDetails.name}
            </Rb_Text>
            <Rb_Text className="text-sm text-gray-600">
              {order.hubDetails.address}, {order.hubDetails.city}
            </Rb_Text>
          </div>
        </div>
      );
    }

    if (
      order.deliveryType === "HUB_TO_USER" &&
      order.userDetails &&
      (order.orderStatus === "Delivery Agent Assigned" ||
        order.orderStatus === "Out For Delivery")
    ) {
      const address = order.userDetails.address;

      return (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          <div className="min-w-0">
            <Rb_Text className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Delivery location
            </Rb_Text>
            <Rb_Text className="text-sm text-gray-700">
              {address.street}, {address.city}, {address.state}
            </Rb_Text>
            <Rb_Text className="text-xs text-gray-400">
              {address.zipCode}
            </Rb_Text>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderStatus = (order: AgentOrder) => {
    if (
      order.deliveryType === "SELLER_TO_HUB" &&
      order.orderStatus === "Pickup Assigned"
    ) {
      return (
        <div className="shrink-0">
          <Dropdown
            options={[
              { label: "Pickup Assigned", value: "Pickup Assigned" },
              { label: "Out For Pickup", value: "Out For Pickup" },
            ]}
            value={order.orderStatus}
            onChange={(value) =>
              handleStatusChange(order.orderId, value as OrderStatus)
            }
          />
        </div>
      );
    }

    if (
      order.deliveryType === "HUB_TO_USER" &&
      order.orderStatus === "Delivery Agent Assigned"
    ) {
      return (
        <div className="shrink-0">
          <Dropdown
            options={[
              {
                label: "Delivery Assigned",
                value: "Delivery Agent Assigned",
              },
              { label: "Out For Delivery", value: "Out For Delivery" },
            ]}
            value={order.orderStatus}
            onChange={(value) =>
              handleStatusChange(order.orderId, value as OrderStatus)
            }
          />
        </div>
      );
    }

    const meta = STATUS_META[order.orderStatus];
    if (!meta) {
      return (
        <span className="inline-flex shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          {order.orderStatus}
        </span>
      );
    }

    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.badge}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
        {meta.label}
      </span>
    );
  };

  return (
    <div className="w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-900">My Orders</h4>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track your assigned pickup and delivery orders
        </p>
      </div>

      <div
  className="mb-6 flex flex-wrap gap-2"
  role="tablist"
  aria-label="Filter orders by status"
>
  {TABS.map((tab) => {
    const isActive = activeTab === tab.key;
    const count = counts[tab.key] ?? 0;

    return (
      <button
        key={tab.key}
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={() => setActiveTab(tab.key)}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <span>{tab.label}</span>

        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            isActive
              ? "bg-white/20 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          {count}
        </span>
      </button>
    );
  })}
</div>

      {/* {isPending && <OrdersSkeleton />}

      {!isPending && isError && <ErrorState onRetry={() => refetch()} />} */}

      {!isPending && !isError && (
        <div className="space-y-3">
          {filteredOrders.length === 0 && (
            <EmptyState
              message={
                EMPTY_STATE_COPY[activeTab] ??
                "No orders in this category yet."
              }
            />
          )}

          {filteredOrders.map((order) => {
            const item = order.items?.[0] ?? null;

            return (
              <div
                key={order.orderId}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex gap-4">
                  <Rb_Image
                    src={item?.coverImage || "/images/book-placeholder.png"}
                    alt={item?.bookName || "Book cover"}
                    className="h-20 w-16 shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Rb_Text className="text-sm font-semibold text-gray-900">
                          Order #{getOrderNumber(order)}
                        </Rb_Text>

                        {item?.bookName && (
                          <Rb_Text className="mt-1 truncate text-sm text-gray-800">
                            {item.bookName}
                          </Rb_Text>
                        )}

                        {item?.author && (
                          <Rb_Text className="truncate text-xs text-gray-500">
                            by {item.author}
                          </Rb_Text>
                        )}

                        {order.items && order.items.length > 1 && (
                          <Rb_Text className="mt-0.5 text-xs text-gray-400">
                            +{order.items.length - 1} more item
                            {order.items.length - 1 > 1 ? "s" : ""}
                          </Rb_Text>
                        )}
                      </div>

                      {renderStatus(order)}
                    </div>

                    {renderLocation(order)}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <Rb_Text className="text-xs text-gray-400">
                    Assigned {formatDate(order.assignedDate)}
                  </Rb_Text>

                  <Rb_Button
                    variant="primary"
                    onClick={() =>
                      navigateTo(`/agent/pickup-orders/${order.shipmentId}`)
                    }
                  >
                    View details
                  </Rb_Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgentOrders;