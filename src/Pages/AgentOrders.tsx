import { useMemo, useState } from "react";
import {
  Dropdown,
  Rb_Button,
  Rb_Image,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

import type {
  AgentOrder,
  OrderStatus,
} from "../Types/AgentTypes";

import { orderResponse } from "../mock/OrderDetails";

// ============================================================
// STATUS META
// ============================================================

const STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    badge: string;
    dot: string;
  }
> = {
  Assigned: {
    label: "Assigned",
    badge: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },

  "Out for Pickup": {
    label: "Out for Pickup",
    badge: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },

  "Pickup Successful": {
    label: "Pickup Successful",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },

  "Submitted to Admin": {
    label: "Submitted to Admin",
    badge: "bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
  },

  Completed: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },

  "Assigned for Delivery": {
    label: "Assigned for Delivery",
    badge: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },

  "Collected from Hub": {
    label: "Collected from Hub",
    badge: "bg-cyan-50 text-cyan-700",
    dot: "bg-cyan-500",
  },

  "Out for Delivery": {
    label: "Out for Delivery",
    badge: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },

  Delivered: {
    label: "Delivered",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

// ============================================================
// TABS
// ============================================================

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "Assigned", label: "Assigned" },
  { key: "Out for Pickup", label: "Out for Pickup" },
  { key: "Pickup Successful", label: "Pickup Successful" },
  { key: "Submitted to Admin", label: "Submitted to Admin" },
  { key: "Completed", label: "Completed" },
  { key: "Assigned for Delivery", label: "Assigned for Delivery" },
  { key: "Out for Delivery", label: "Out for Delivery" },
  { key: "Delivered", label: "Delivered" },
] as const;

// ============================================================
// DATE
// ============================================================

const formatDate = (date?: string) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ============================================================
// COMPONENT
// ============================================================

const AgentOrders = () => {
  const [orders, setOrders] =
    useState<AgentOrder[]>(orderResponse);

  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["key"]>("all");

  // ============================================================
  // COUNTS
  // ============================================================

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      all: orders.length,
    };

    orders.forEach((order) => {
      result[order.orderStatus] =
        (result[order.orderStatus] || 0) + 1;
    });

    return result;
  }, [orders]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") {
      return orders;
    }

    return orders.filter(
      (order) => order.orderStatus === activeTab
    );
  }, [activeTab, orders]);

  // ============================================================
  // STATUS CHANGE
  // ============================================================

  const handleStatusChange = (
    orderId: string,
    status: OrderStatus
  ) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              orderStatus: status,
            }
          : order
      )
    );

    // TODO:
    // updateAgentOrderStatus(orderId, status);
  };

  // ============================================================
  // LOCATION
  // ============================================================

  const renderLocation = (order: AgentOrder) => {
    // ----------------------------------------------------------
    // SELLER → HUB
    // Assigned / Out for Pickup
    // ----------------------------------------------------------

    if (
      order.deliveryType === "SELLER_TO_HUB" &&
      order.sellerDetails &&
      (order.orderStatus === "Assigned" ||
        order.orderStatus === "Out for Pickup")
    ) {
      const address =
        order.sellerDetails.address;

      return (
        <div className="mt-4 flex items-start gap-2">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

          <div>
            <Rb_Text className="text-xs font-medium text-gray-400">
              Pickup Location
            </Rb_Text>

            <Rb_Text className="text-sm text-gray-700">
              {address.street},{" "}
              {address.city},{" "}
              {address.state}
            </Rb_Text>

            <Rb_Text className="text-xs text-gray-400">
              {address.zipCode}
            </Rb_Text>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------------
    // SELLER → HUB
    // Pickup Successful / Submitted / Completed
    // Show HUB instead of seller
    // ----------------------------------------------------------

    if (
      order.deliveryType === "SELLER_TO_HUB" &&
      order.hubDetails &&
      (order.orderStatus === "Pickup Successful" ||
        order.orderStatus === "Submitted to Admin" ||
        order.orderStatus === "Completed")
    ) {
      return (
        <div className="mt-4 flex items-start gap-2">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />

          <div>
            <Rb_Text className="text-xs font-medium text-gray-400">
              Hub
            </Rb_Text>

            <Rb_Text className="text-sm font-medium text-gray-800">
              {order.hubDetails.name}
            </Rb_Text>

            <Rb_Text className="text-sm text-gray-600">
              {order.hubDetails.address},{" "}
              {order.hubDetails.city}
            </Rb_Text>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------------
    // HUB → USER
    // ----------------------------------------------------------

    if (
      order.deliveryType === "HUB_TO_USER" &&
      order.userDetails &&
      (order.orderStatus === "Assigned for Delivery" ||
        order.orderStatus === "Out for Delivery")
    ) {
      const address =
        order.userDetails.address;

      return (
        <div className="mt-4 flex items-start gap-2">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

          <div>
            <Rb_Text className="text-xs font-medium text-gray-400">
              Delivery Location
            </Rb_Text>

            <Rb_Text className="text-sm text-gray-700">
              {address.street},{" "}
              {address.city},{" "}
              {address.state}
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

  // ============================================================
  // STATUS UI
  // ============================================================

  const renderStatus = (order: AgentOrder) => {
    // ----------------------------------------------------------
    // SELLER → HUB
    // Assigned → Out for Pickup
    // ----------------------------------------------------------

    if (
      order.deliveryType === "SELLER_TO_HUB" &&
      order.orderStatus === "Assigned"
    ) {
      return (
        <div className="shrink-0">
          <Dropdown
            options={[
              {
                label: "Assigned",
                value: "Assigned",
              },
              {
                label: "Out for Pickup",
                value: "Out for Pickup",
              },
            ]}
            value={order.orderStatus}
            onChange={(value) =>
              handleStatusChange(
                order.orderId,
                value as OrderStatus
              )
            }
          />
        </div>
      );
    }

    // ----------------------------------------------------------
    // HUB → USER
    // Assigned for Delivery → Out for Delivery
    // ----------------------------------------------------------

    if (
      order.deliveryType === "HUB_TO_USER" &&
      order.orderStatus === "Assigned for Delivery"
    ) {
      return (
        <div className="shrink-0">
          <Dropdown
            options={[
              {
                label: "Assigned for Delivery",
                value: "Assigned for Delivery",
              },
              {
                label: "Out for Delivery",
                value: "Out for Delivery",
              },
            ]}
            value={order.orderStatus}
            onChange={(value) =>
              handleStatusChange(
                order.orderId,
                value as OrderStatus
              )
            }
          />
        </div>
      );
    }

    // ----------------------------------------------------------
    // NORMAL STATUS BADGE
    // ----------------------------------------------------------

    const meta = STATUS_META[order.orderStatus];

    // Safety fallback
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
        <span
          className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
        />

        {meta.label}
      </span>
    );
  };

  // ============================================================
  // NAVIGATE TO DETAILS
  // ============================================================

  const navigateTo = (path: string) => { window.history.pushState({}, "", path); window.dispatchEvent(new PopStateEvent("popstate")); };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-900">
          My Orders
        </h4>

        <p className="mt-1 text-sm text-gray-500">
          Manage and track your assigned pickup orders
        </p>
      </div>

      {/* ======================================================
          TABS
      ====================================================== */}

      <div className="mb-6 flex overflow-x-auto border-b border-gray-200">
        {TABS.map((tab) => {
          const isActive =
            activeTab === tab.key;

          const count =
            counts[tab.key] || 0;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() =>
                setActiveTab(tab.key)
              }
              className={`relative flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "text-violet-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}

              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  isActive
                    ? "bg-violet-100 text-violet-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>

              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================
          ORDERS
      ====================================================== */}

      <div className="space-y-3">
        {filteredOrders.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500">
            No orders in this category yet.
          </div>
        )}

        {filteredOrders.map((order) => {
          const item = order.items[0];

          return (
            <div
              key={order.orderId}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {/* ==================================================
                  MAIN
              ================================================== */}

              <div className="flex gap-4">

                {/* BOOK IMAGE */}

                <Rb_Image
                  src={item.coverImage}
                  alt={item.bookName}
                  className="h-20 w-16 shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
                />

                {/* DETAILS */}

                <div className="min-w-0 flex-1">

                  {/* HEADER */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Rb_Text className="text-sm font-semibold text-gray-900">
                        Order #
                        {order.orderNumber
                          .replace(/^ORD/, "")
                          .slice(-6)}
                      </Rb_Text>

                      <Rb_Text className="mt-1 text-sm text-gray-800">
                        {item.bookName}
                      </Rb_Text>

                      <Rb_Text className="text-xs text-gray-500">
                        by {item.author}
                      </Rb_Text>
                    </div>

                    {renderStatus(order)}
                  </div>

                  {/* LOCATION */}

                  {renderLocation(order)}
                </div>
              </div>

              {/* ==================================================
                  FOOTER
              ================================================== */}

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <Rb_Text className="text-xs text-gray-400">
                  Assigned{" "}
                  {formatDate(
                    order.assignedDate
                  )}
                </Rb_Text>

                <Rb_Button variant="primary" onClick={() => navigateTo(`/agent-orders/${order.orderId}`)} > View Details </Rb_Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentOrders;

