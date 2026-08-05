import { useMemo } from "react";
import { Dropdown, Rb_Button, Rb_Image, Rb_Text } from "@rentbook/rentbook-ui-lib";

import { useAgentOrders } from "../hooks/useAgentOrders";
import type { OrderStatus } from "../Types/AgentTypes";
import { useUpdateShipmentStatus } from "../hooks/useUpdateShipmentStatus";
import { STATUS_CONFIG } from "../constants/shipmentStatus";
import type { AgentOrder } from "../Types/AgentTypes";
// import { AgentOrderDetailsMock } from "../mock/AgentOrderDetails";

const DELIVERY_STATUSES: OrderStatus[] = [
  "Delivery Agent Assigned",
  "Out For Delivery",
  "Delivered",
];


const AgentDeliveryOrders = () => {
  const agentId = "6a6b10202eb459f877594bb0";
  const { mutate: updateShipmentStatus } = useUpdateShipmentStatus();
  const { data: orders = [], isPending, isError, } = useAgentOrders(agentId);
  // const orders: AgentOrder[] = AgentOrderDetailsMock;

  // const isPending = false;
  // const isError = false;
  const deliveryOrders = useMemo(() => {
    return orders.filter((order) =>
      DELIVERY_STATUSES.includes(order.orderStatus)
    );
  }, [orders]);

  const handleStatusChange = (
    order: AgentOrder,
    status: OrderStatus
  ) => {
    if (!order.shipmentId) return;

    updateShipmentStatus({
      shipmentId: order.shipmentId,
      payload: {
        status,
        event: STATUS_CONFIG[status]!.event,
        remarks: STATUS_CONFIG[status]!.remarks,
        agentId,
        updatedBy: agentId,
      },
    });
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong</div>;

  return (
    <div className="w-full max-w-5xl px-4 py-6">
      <h4 className="mb-6 text-xl font-semibold">Delivery Orders</h4>

      {deliveryOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <Rb_Text>No delivery orders found.</Rb_Text>
        </div>
      ) : (
        <div className="space-y-3">
          {deliveryOrders.map((order) => {
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
                          Order #
                          {order.orderNumber?.replace(/^ORD/, "").slice(-6)}
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

                      {order.orderStatus ===
                      "Delivery Agent Assigned" ? (
                        <div className="shrink-0">
                        <Dropdown
                          options={[
                            {
                              label: "Delivery Assigned",
                              value: "Delivery Agent Assigned",
                            },
                            {
                              label: "Out For Delivery",
                              value: "Out For Delivery",
                            },
                          ]}
                          value={order.orderStatus}
                          onChange={(value) =>
                            handleStatusChange(
                              order,
                              value as OrderStatus
                            )
                          }
                        />
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            order.orderStatus === "Delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              order.orderStatus === "Delivered"
                                ? "bg-emerald-500"
                                : "bg-blue-500"
                            }`}
                          />
                          {order.orderStatus}
                        </span>
                      )}
                    </div>

                    {order.userDetails && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                        <div className="min-w-0">
                          <Rb_Text className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            Delivery Location
                          </Rb_Text>

                          <Rb_Text className="text-sm text-gray-700">
                            {order.userDetails.address.street},{" "}
                            {order.userDetails.address.city},{" "}
                            {order.userDetails.address.state}
                          </Rb_Text>

                          <Rb_Text className="text-xs text-gray-400">
                            {order.userDetails.address.zipCode}
                          </Rb_Text>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <Rb_Text className="text-xs text-gray-400">
                    Assigned{" "}
                    {order.assignedDate
                    ? new Date(order.assignedDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                  </Rb_Text>

                  <Rb_Button
                    variant="primary"
                    onClick={() => {
                      window.history.pushState(
                        {},
                        "",
                        `/agent-orders/${order.shipmentId}`
                      );
                      window.dispatchEvent(
                        new PopStateEvent("popstate")
                      );
                    }}
                  >
                    View Details
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

export default AgentDeliveryOrders;