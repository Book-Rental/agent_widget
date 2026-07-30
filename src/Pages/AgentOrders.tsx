import { useMemo, useState } from "react";
import {
  Rb_Button,
  Rb_Text,
  Dropdown,
} from "@rentbook/rentbook-ui-lib";

type OrderStatus =
  | "Assigned"
  | "Out for Pickup"
  | "Picked Up"
  | "Going to Hub"
  | "Handed Over to Hub"
  | "Completed"
  | "Cancelled";

type Address = {
  name: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
};

type HubDetails = {
  hubId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  distance?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
};

type AgentOrder = {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  AssignedDate: string;
  pickupDate?: string;
  hubHandoverDate?: string;
  orderStatus: OrderStatus;

  items: {
    bookId: string;
    bookName: string;
    author: string;
    coverImage: string;
    quantity: number;
  }[];

  sellerDetails: {
    name: string;
    phoneNumber: string;
    sellerId: string;
    address: Address[];
  };

  hubDetails?: HubDetails;
};

const orderResponse: AgentOrder[] = [
  {
    orderId: "6a688d51fee54ef848305cbe",
    orderNumber: "ORD1785236817175",
    orderDate: "2026-07-28T11:06:57.183Z",
    AssignedDate: "2026-07-28",
    orderStatus: "Assigned",

    items: [
      {
        bookId: "6a3cfcad1d1789437feae0a5",
        bookName: "Beloved",
        author: "Toni Morrison",
        coverImage:
          "https://res.cloudinary.com/dlggszqj9/image/upload/v1782381739/BookImages/Beloved-cover.webp.jpg",
        quantity: 1,
      },
    ],

    sellerDetails: {
      name: "Test",
      phoneNumber: "1234567890",
      sellerId: "6a3ceeb6fe292d89939928de",

      address: [
        {
          name: "Ambedkar circle",
          type: "home",
          street: "Navirman Nagar",
          city: "Hyderabad",
          state: "Telangana",
          zipCode: "500096",
          country: "India",
          phone: "4083285219",

          location: {
            type: "Point",
            coordinates: [
              78.42261018992527,
              17.425446193556382,
            ],
          },
        },
      ],
    },
  },

  {
    orderId: "6a684f72bce6baf7647e58d7",
    orderNumber: "ORD1785220978266",
    orderDate: "2026-07-24T11:06:57.183Z",
    AssignedDate: "2026-07-25",
    pickupDate: "2026-07-26",
    orderStatus: "Picked Up",

    items: [
      {
        bookId: "6a3cfcad1d1789437feae0a5",
        bookName: "Beloved",
        author: "Toni Morrison",
        coverImage:
          "https://res.cloudinary.com/dlggszqj9/image/upload/v1782381739/BookImages/Beloved-cover.webp.jpg",
        quantity: 1,
      },
    ],

    sellerDetails: {
      name: "Test",
      phoneNumber: "1234567890",
      sellerId: "6a3ceeb6fe292d89939928de",

      address: [
        {
          name: "",
          type: "home",
          street: "Road No. 2",
          city: "Hyderabad",
          state: "Telangana",
          zipCode: "500096",
          country: "India",
          phone: "7777777777",

          location: {
            type: "Point",
            coordinates: [
              78.42204959873321,
              17.4259243184041,
            ],
          },
        },
      ],
    },

    hubDetails: {
      hubId: "HYD-HUB-01",
      name: "Hyderabad Central Hub",
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      distance: "5.2 km",

      location: {
        type: "Point",
        coordinates: [
          78.3915,
          17.4485,
        ],
      },
    },
  },
];

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

  "Picked Up": {
    label: "Picked Up",
    badge: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },

  "Going to Hub": {
    label: "Going to Hub",
    badge: "bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
  },

  "Handed Over to Hub": {
    label: "Handed Over to Hub",
    badge: "bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
  },

  Completed: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },

  Cancelled: {
    label: "Cancelled",
    badge: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
};

const TABS = [
  {
    key: "all",
    label: "All Orders",
  },
  {
    key: "Assigned",
    label: "Assigned",
  },
  {
    key: "Out for Pickup",
    label: "Out for Pickup",
  },
  {
    key: "Picked Up",
    label: "Picked Up",
  },
  {
    key: "Going to Hub",
    label: "Going to Hub",
  },
  {
    key: "Completed",
    label: "Completed",
  },
] as const;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const AgentOrders = () => {
  const [orders, setOrders] =
    useState<AgentOrder[]>(orderResponse);

  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["key"]>("all");

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

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") {
      return orders;
    }

    return orders.filter(
      (order) => order.orderStatus === activeTab
    );
  }, [activeTab, orders]);

  const handleStatusChange = (
    orderId: string,
    status: "Assigned" | "Out for Pickup"
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

    // API example:
    // updateAgentOrderStatus(orderId, status);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-900">
          My Orders
        </h4>

        <p className="mt-1 text-sm text-gray-500">
          Manage and track your assigned pickup orders
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex overflow-x-auto border-b border-gray-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key] || 0;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
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

      {/* Orders */}
      <div className="space-y-3">
        {filteredOrders.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500">
            No orders in this category yet.
          </div>
        )}

        {filteredOrders.map((order) => {
          const item = order.items[0];
          const address = order.sellerDetails.address[0];
          const meta = STATUS_META[order.orderStatus];

          const showPickupAddress =
            order.orderStatus === "Assigned" ||
            order.orderStatus === "Out for Pickup";

          const showHub =
            order.orderStatus === "Picked Up" ||
            order.orderStatus === "Going to Hub" ||
            order.orderStatus === "Handed Over to Hub";

          return (
            <div
              key={order.orderId}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {/* Main */}
              <div className="flex gap-4">
                {/* Book */}
                <img
                  src={item.coverImage}
                  alt={item.bookName}
                  className="h-20 w-16 shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
                />

                {/* Details */}
                <div className="min-w-0 flex-1">
                  {/* Header */}
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

                    {/* Status */}
                    {order.orderStatus === "Assigned" ? (
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
                              value as
                                | "Assigned"
                                | "Out for Pickup"
                            )
                          }
                        />
                      </div>
                    ) : (
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.badge}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
                        />

                        {meta.label}
                      </span>
                    )}
                  </div>

                  {/* Seller Pickup */}
                  {showPickupAddress && (
                    <div className="mt-4 flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                      <div>
                        <Rb_Text className="text-xs font-medium text-gray-400">
                          Pickup Location
                        </Rb_Text>

                        <Rb_Text className="text-sm text-gray-700">
                          {address.street
                            ? `${address.street}, `
                            : ""}
                          {address.city},{" "}
                          {address.state}
                        </Rb_Text>

                        <Rb_Text className="text-xs text-gray-400">
                          {address.zipCode}
                        </Rb_Text>
                      </div>
                    </div>
                  )}

                  {/* Hub */}
                  {showHub && order.hubDetails && (
                    <div className="mt-4 flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />

                      <div>
                        <Rb_Text className="text-xs font-medium text-gray-400">
                          Nearest Hub
                        </Rb_Text>

                        <Rb_Text className="text-sm font-medium text-gray-800">
                          {order.hubDetails.name}
                        </Rb_Text>

                        <Rb_Text className="text-sm text-gray-600">
                          {order.hubDetails.address},{" "}
                          {order.hubDetails.city}
                        </Rb_Text>

                        {order.hubDetails.distance && (
                          <Rb_Text className="text-xs text-gray-400">
                            {order.hubDetails.distance} away
                          </Rb_Text>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <Rb_Text className="text-xs text-gray-400">
                  {order.pickupDate &&
                  order.orderStatus !== "Assigned"
                    ? `Picked up ${formatDate(
                        order.pickupDate
                      )}`
                    : `Assigned ${formatDate(
                        order.AssignedDate
                      )}`}
                </Rb_Text>

                <Rb_Button
                  variant="primary"
                  className="px-3 py-1.5 text-xs"
                >
                  View Details
                </Rb_Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentOrders;