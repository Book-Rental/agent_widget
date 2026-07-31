import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiMap,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

import {
  Dropdown,
  Rb_Button,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

import type { OrderStatus } from "../Types/AgentTypes";
import { orderResponse } from "../mock/OrderDetails";

const AgentPickDetails = () => {
  // ============================================================
  // ORDER
  // ============================================================

  const orderId =
    window.location.pathname.split("/").pop();

  const order = orderResponse.find(
    (item) => item.orderId === orderId
  );

  const item = order?.items?.[0];

  // ============================================================
  // STATE
  // ============================================================

  const [currentStatus, setCurrentStatus] =
    useState<OrderStatus>(
      order?.orderStatus ?? "Assigned"
    );

  const [distance, setDistance] =
    useState<number | null>(null);

  const [eta, setEta] =
    useState<number | null>(null);

  const [locationLoading, setLocationLoading] =
    useState(true);

  // ============================================================
  // ORDER DATA
  // ============================================================

  const isSellerToHub =
    order?.deliveryType === "SELLER_TO_HUB";

  const isHubToUser =
    order?.deliveryType === "HUB_TO_USER";

  const seller = order?.sellerDetails;
  const sellerAddress = seller?.address;

  const hub = order?.hubDetails;

  const user = order?.userDetails;
  const userAddress = user?.address;

  // ============================================================
  // STATUS FLAGS
  // ============================================================

  const isAssigned =
    currentStatus === "Assigned";

  const isOutForPickup =
    currentStatus === "Out for Pickup";

  const isPickupSuccessful =
    currentStatus === "Pickup Successful";

  const isSubmittedToAdmin =
    currentStatus === "Submitted to Admin";

  const isCompleted =
    currentStatus === "Completed";

  // HUB → USER

  const isAssignedForDelivery =
    currentStatus === "Assigned for Delivery";

  const isCollectedFromHub =
    currentStatus === "Collected from Hub";

  const isOutForDelivery =
    currentStatus === "Out for Delivery";

  const isDelivered =
    currentStatus === "Delivered";

  // ============================================================
  // SYNC STATUS
  // ============================================================

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderStatus);
    }
  }, [order]);

  // ============================================================
  // PICKUP / DELIVERY COORDINATES
  // ============================================================

  const coordinates = useMemo(() => {
    if (isSellerToHub) {
      return sellerAddress?.location?.coordinates;
    }

    if (isHubToUser) {
      return userAddress?.location?.coordinates;
    }

    return undefined;
  }, [
    isSellerToHub,
    isHubToUser,
    sellerAddress,
    userAddress,
  ]);

  // ============================================================
  // DISTANCE
  // ============================================================

  const calculateDistance = (
    agentLat: number,
    agentLng: number,
    destinationLat: number,
    destinationLng: number
  ) => {
    const earthRadius = 6371;

    const dLat =
      ((destinationLat - agentLat) * Math.PI) / 180;

    const dLng =
      ((destinationLng - agentLng) * Math.PI) / 180;

    const lat1 =
      (agentLat * Math.PI) / 180;

    const lat2 =
      (destinationLat * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLng / 2) ** 2;

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  };

  // ============================================================
  // GET AGENT LOCATION
  // ============================================================

  useEffect(() => {
    if (!coordinates || !navigator.geolocation) {
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const agentLat =
          position.coords.latitude;

        const agentLng =
          position.coords.longitude;

        const [destinationLng, destinationLat] =
          coordinates;

        const calculatedDistance =
          calculateDistance(
            agentLat,
            agentLng,
            destinationLat,
            destinationLng
          );

        setDistance(calculatedDistance);

        setEta(
          Math.ceil(
            (calculatedDistance / 30) * 60
          )
        );

        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, [coordinates]);

  // ============================================================
  // ORDER NOT FOUND
  // ============================================================

  if (!order || !item) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <Rb_Text className="text-lg font-semibold text-gray-900">
            Order not found
          </Rb_Text>

          <Rb_Text className="mt-2 text-sm text-gray-500">
            No order found for ID: {orderId}
          </Rb_Text>
        </div>
      </div>
    );
  }

  // ============================================================
  // STATUS META
  // ============================================================

  const statusMeta: Record<
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
      badge: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
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

  const meta = statusMeta[currentStatus];

  // ============================================================
  // STATUS CHANGE
  // ============================================================

  const handleStatusChange = (value: string) => {
    const newStatus =
      value as OrderStatus;

    setCurrentStatus(newStatus);

    console.log("Order status updated:", {
      orderId: order.orderId,
      status: newStatus,
    });

    // TODO:
    // updateAgentOrderStatus(order.orderId, newStatus);
  };

  // ============================================================
  // GOOGLE MAPS
  // ============================================================

  const openMaps = (
    location?: {
      type: string;
      coordinates: number[];
    }
  ) => {
    if (!location?.coordinates) return;

    const [longitude, latitude] =
      location.coordinates;

    const mapsUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${latitude},${longitude}` +
      `&travelmode=driving` +
      `&dir_action=navigate`;

    window.open(
      mapsUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ============================================================
  // CALL CONTACT
  // ============================================================

  const callPhone = (phone?: string) => {
    if (!phone) return;

    window.location.href = `tel:${phone}`;
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const goToVerification = () => {
    window.history.pushState(
      {},
      "",
      `/agent-orders/${order.orderId}/pickup-verification`
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  // ============================================================
  // DATE
  // ============================================================

  const formatDate = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ============================================================
  // TIMELINES
  // ============================================================

  const pickupTimeline = [
    {
      label: "Assigned",
      date: order.assignedDate,
    },
    {
      label: "Pickup Successful",
      date: order.pickupDate,
    },
    {
      label: "Submitted to Admin",
      date: order.hubSubmittedDate,
      description: hub?.name,
    },
    {
      label: "Completed",
      date: order.completedDate,
    },
  ];

  const deliveryTimeline = [
    {
      label: "Assigned for Delivery",
      date: order.assignedDate,
      description: hub?.name,
    },
    {
      label: "Collected from Hub",
      // date: order.hubCollectedDate,
      description: hub?.name,
    },
    {
      label: "Out for Delivery",
      // date: order.outForDeliveryDate,
    },
    {
      label: "Delivered",
      date: order.deliveredDate,
    },
  ];

  const timeline = isHubToUser
    ? deliveryTimeline
    : pickupTimeline;

  // ============================================================
  // RENDER TIMELINE
  // ============================================================

  const renderTimeline = () => (
    <div className="mt-5">
      {timeline.map((step, index) => {
        const completed = !!step.date;
        const last =
          index === timeline.length - 1;

        return (
          <div
            key={step.label}
            className="relative flex gap-4"
          >
            {!last && (
              <div
                className={`absolute left-[9px] top-5 h-full w-px ${
                  completed
                    ? "bg-emerald-400"
                    : "bg-gray-200"
                }`}
              />
            )}

            <div
              className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                completed
                  ? "bg-emerald-500"
                  : "bg-gray-200"
              }`}
            >
              {completed && (
                <FiCheckCircle className="h-3.5 w-3.5 text-white" />
              )}
            </div>

            <div className="pb-6">
              <Rb_Text
                className={`text-sm font-semibold ${
                  completed
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </Rb_Text>

              <Rb_Text className="mt-1 text-xs text-gray-500">
                {step.date
                  ? formatDate(step.date)
                  : "Pending"}
              </Rb_Text>

              {step.description && (
                <Rb_Text className="mt-1 text-xs font-medium text-sky-600">
                  {step.description}
                </Rb_Text>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ============================================================
  // HEADER DROPDOWN
  // ============================================================

  const renderStatusControl = () => {
    // SELLER → HUB
    if (isSellerToHub && isAssigned) {
      return (
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
          value={currentStatus}
          onChange={handleStatusChange}
        />
      );
    }

    // HUB → USER
    if (isHubToUser && isAssignedForDelivery) {
      return (
        <Dropdown
          options={[
            {
              label: "Assigned for Delivery",
              value: "Assigned for Delivery",
            },
            {
              label: "Collected from Hub",
              value: "Collected from Hub",
            },
          ]}
          value={currentStatus}
          onChange={handleStatusChange}
        />
      );
    }

    if (isHubToUser && isCollectedFromHub) {
      return (
        <Dropdown
          options={[
            {
              label: "Collected from Hub",
              value: "Collected from Hub",
            },
            {
              label: "Out for Delivery",
              value: "Out for Delivery",
            },
          ]}
          value={currentStatus}
          onChange={handleStatusChange}
        />
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${meta.badge}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
        />

        {meta.label}
      </span>
    );
  };

  // ============================================================
  // LOCATION CARD
  // ============================================================

  const renderLocationCard = () => {
    // ----------------------------------------------------------
    // SELLER → HUB
    // ----------------------------------------------------------

    if (
      isSellerToHub &&
      sellerAddress &&
      (isAssigned || isOutForPickup)
    ) {
      return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                  <FiMapPin className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <Rb_Text className="text-sm font-semibold text-gray-900">
                    Pickup Location
                  </Rb_Text>

                  <Rb_Text className="text-xs text-gray-500">
                    Seller pickup address
                  </Rb_Text>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  openMaps(
                    sellerAddress.location
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-violet-50"
              >
                <FiMap className="h-3.5 w-3.5" />
                Open in Maps
              </button>
            </div>
          </div>

          <div className="p-5">
            <Rb_Text className="text-sm font-semibold text-gray-900">
              {sellerAddress.name}
            </Rb_Text>

            <Rb_Text className="mt-1 text-sm leading-6 text-gray-600">
              {sellerAddress.street}
              <br />
              {sellerAddress.city},{" "}
              {sellerAddress.state}
              <br />
              {sellerAddress.zipCode},{" "}
              {sellerAddress.country}
            </Rb_Text>

            <LocationStats
              loading={locationLoading}
              distance={distance}
              eta={eta}
            />
          </div>
        </div>
      );
    }

    // ----------------------------------------------------------
    // HUB → USER
    // Hub details while collecting
    // ----------------------------------------------------------

    if (
      isHubToUser &&
      hub &&
      isAssignedForDelivery
    ) {
      return (
        <LocationCard
          title="Pickup from Hub"
          subtitle="Collect the book from the assigned hub"
          name={hub.name}
          address={hub.address}
          city={hub.city}
          onMap={() =>
            openMaps(hub.location)
          }
          phone={hub.receivedBy?.phoneNumber}
        />
      );
    }

    // ----------------------------------------------------------
    // HUB → USER
    // User details after collecting
    // ----------------------------------------------------------

    if (
      isHubToUser &&
      user &&
      userAddress &&
      (isCollectedFromHub ||
        isOutForDelivery ||
        isDelivered)
    ) {
      return (
        <LocationCard
          title="Delivery Location"
          subtitle="Customer delivery address"
          name={user.name}
          address={userAddress.street}
          city={`${userAddress.city}, ${userAddress.state}`}
          zipCode={userAddress.zipCode}
          onMap={() =>
            openMaps(userAddress.location)
          }
          phone={user.phoneNumber}
        />
      );
    }

    // ----------------------------------------------------------
    // SELLER → HUB
    // HUB details after pickup
    // ----------------------------------------------------------

    if (
      isSellerToHub &&
      hub &&
      (isPickupSuccessful ||
        isSubmittedToAdmin ||
        isCompleted)
    ) {
      return (
        <LocationCard
          title="Hub Details"
          subtitle="Submit the picked-up book here"
          name={hub.name}
          address={hub.address}
          city={hub.city}
          onMap={() =>
            openMaps(hub.location)
          }
          phone={hub.receivedBy?.phoneNumber}
        />
      );
    }

    return null;
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">

        {/* HEADER */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Rb_Text className="text-xl font-semibold text-gray-900">
              {isHubToUser
                ? "Delivery Details"
                : "Pickup Details"}
            </Rb_Text>

            <Rb_Text className="mt-1 text-sm text-gray-500">
              Order #
              {order.orderNumber.replace(
                /^ORD/,
                ""
              )}
            </Rb_Text>
          </div>

          {renderStatusControl()}
        </div>

        {/* ORDER DETAILS */}

        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <FiBookOpen className="h-4 w-4 text-gray-600" />
            </div>

            <Rb_Text className="text-sm font-semibold text-gray-900">
              Order Details
            </Rb_Text>
          </div>

          <div className="flex gap-4">
            <img
              src={item.coverImage}
              alt={item.bookName}
              className="h-24 w-[68px] shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
            />

            <div>
              <Rb_Text className="text-base font-semibold text-gray-900">
                {item.bookName}
              </Rb_Text>

              <Rb_Text className="mt-1 text-sm text-gray-500">
                by {item.author}
              </Rb_Text>

              <span className="mt-3 inline-flex rounded-md bg-gray-50 px-2.5 py-1">
                <Rb_Text className="text-xs font-medium text-gray-600">
                  Quantity: {item.quantity}
                </Rb_Text>
              </span>
            </div>
          </div>
        </div>

        {/* CONTACT */}

        {isSellerToHub &&
          seller &&
          (isAssigned || isOutForPickup) && (
            <ContactCard
              title="Pickup Contact"
              name={seller.name}
              phone={seller.phoneNumber}
              onCall={() =>
                callPhone(
                  seller.phoneNumber
                )
              }
            />
          )}

        {isHubToUser &&
          user &&
          (isCollectedFromHub ||
            isOutForDelivery ||
            isDelivered) && (
            <ContactCard
              title="Delivery Contact"
              name={user.name}
              phone={user.phoneNumber}
              onCall={() =>
                callPhone(
                  user.phoneNumber
                )
            }
            />
          )}

        {/* LOCATION */}

        {renderLocationCard()}

        {/* PROGRESS */}

        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <Rb_Text className="text-sm font-semibold text-gray-900">
            {isHubToUser
              ? "Delivery Progress"
              : "Pickup Progress"}
          </Rb_Text>

          {renderTimeline()}
        </div>

        {/* ACTION MESSAGE */}

        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
          <Rb_Text className="text-sm font-semibold text-gray-800">
            {isAssigned &&
              "Pickup not started"}

            {isOutForPickup &&
              "You are on the way to pickup"}

            {isPickupSuccessful &&
              "Book picked up successfully"}

            {isSubmittedToAdmin &&
              "Book submitted to admin"}

            {isCompleted &&
              "Order completed successfully"}

            {isAssignedForDelivery &&
              "Book is ready for collection from the hub"}

            {isCollectedFromHub &&
              "Book collected from hub"}

            {isOutForDelivery &&
              "You are on the way to the customer"}

            {isDelivered &&
              "Book delivered successfully"}
          </Rb_Text>

          <Rb_Text className="mt-1 text-xs leading-5 text-gray-600">
            {isAssigned &&
              "Change the status to Out for Pickup when you leave to collect the book."}

            {isOutForPickup &&
              "Navigate to the seller location and complete pickup verification."}

            {isPickupSuccessful &&
              `Take the book to ${
                hub?.name ?? "the assigned hub"
              }.`}

            {isSubmittedToAdmin &&
              "Waiting for admin verification."}

            {isCompleted &&
              "The hub has verified the book. This task is completed."}

            {isAssignedForDelivery &&
              `Go to ${
                hub?.name ?? "the assigned hub"
              } and collect the book.`}

            {isCollectedFromHub &&
              "The book has been collected. Change the status to Out for Delivery when you leave the hub."}

            {isOutForDelivery &&
              "Navigate to the customer's delivery address."}

            {isDelivered &&
              "The book has been successfully delivered to the customer."}
          </Rb_Text>
        </div>

        {/* SELLER → HUB ACTIONS */}

        {isSellerToHub &&
          isOutForPickup && (
            <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Rb_Text className="text-sm font-semibold text-gray-900">
                    Ready to pickup?
                  </Rb_Text>

                  <Rb_Text className="mt-0.5 text-xs text-gray-500">
                    Start pickup verification after
                    reaching the seller.
                  </Rb_Text>
                </div>

                <Rb_Button
                  variant="primary"
                  className="flex shrink-0 items-center gap-2 px-4 py-2 text-sm"
                  onClick={goToVerification}
                >
                  Proceed to Pickup
                  <FiArrowRight className="h-4 w-4" />
                </Rb_Button>
              </div>
            </div>
          )}

        {isSellerToHub &&
          isPickupSuccessful && (
            <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Rb_Text className="text-sm font-semibold text-gray-900">
                    Arrived at hub?
                  </Rb_Text>

                  <Rb_Text className="mt-0.5 text-xs text-gray-500">
                    Submit the book to the hub manager.
                  </Rb_Text>
                </div>

                <Rb_Button
                  variant="primary"
                  className="px-4 py-2 text-sm"
                  onClick={() =>
                    handleStatusChange(
                      "Submitted to Admin"
                    )
                  }
                >
                  Submit to Admin
                </Rb_Button>
              </div>
            </div>
          )}

        {/* HUB → USER ACTION */}

        {isHubToUser &&
          isAssignedForDelivery && (
            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Rb_Text className="text-sm font-semibold text-gray-900">
                    Ready to collect?
                  </Rb_Text>

                  <Rb_Text className="mt-0.5 text-xs text-gray-500">
                    Go to the hub and collect the book.
                  </Rb_Text>
                </div>

                <Rb_Button
                  variant="primary"
                  className="flex shrink-0 items-center gap-2 px-4 py-2 text-sm"
                  onClick={() =>
                    handleStatusChange(
                      "Collected from Hub"
                    )
                  }
                >
                  Collected from Hub
                  <FiArrowRight className="h-4 w-4" />
                </Rb_Button>
              </div>
            </div>
          )}

        {isHubToUser &&
          isCollectedFromHub && (
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Rb_Text className="text-sm font-semibold text-gray-900">
                    Ready for delivery?
                  </Rb_Text>

                  <Rb_Text className="mt-0.5 text-xs text-gray-500">
                    Leave the hub and start delivery.
                  </Rb_Text>
                </div>

                <Rb_Button
                  variant="primary"
                  className="flex shrink-0 items-center gap-2 px-4 py-2 text-sm"
                  onClick={() =>
                    handleStatusChange(
                      "Out for Delivery"
                    )
                  }
                >
                  Out for Delivery
                  <FiArrowRight className="h-4 w-4" />
                </Rb_Button>
              </div>
            </div>
          )}

        {isHubToUser &&
          isOutForDelivery && (
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Rb_Text className="text-sm font-semibold text-gray-900">
                    Arrived at customer?
                  </Rb_Text>

                  <Rb_Text className="mt-0.5 text-xs text-gray-500">
                    Complete delivery after handing
                    over the book.
                  </Rb_Text>
                </div>

                <Rb_Button
                  variant="primary"
                  className="px-4 py-2 text-sm"
                  onClick={() =>
                    handleStatusChange(
                      "Delivered"
                    )
                  }
                >
                  Mark Delivered
                </Rb_Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

// ============================================================
// CONTACT CARD
// ============================================================

type ContactCardProps = {
  title: string;
  name: string;
  phone?: string;
  onCall: () => void;
};

const ContactCard = ({
  title,
  name,
  phone,
  onCall,
}: ContactCardProps) => {
  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
            <FiUser className="h-4 w-4 text-gray-600" />
          </div>

          <Rb_Text className="text-sm font-semibold text-gray-900">
            {title}
          </Rb_Text>
        </div>

        <button
          type="button"
          onClick={onCall}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-50"
        >
          Call
        </button>
      </div>

      <Rb_Text className="text-sm font-semibold text-gray-800">
        {name}
      </Rb_Text>

      {phone && (
        <Rb_Text className="mt-1 text-sm text-gray-500">
          +91 {phone}
        </Rb_Text>
      )}
    </div>
  );
};

// ============================================================
// LOCATION CARD
// ============================================================

type LocationCardProps = {
  title: string;
  subtitle: string;
  name: string;
  address: string;
  city?: string;
  zipCode?: string;
  phone?: string;
  onMap: () => void;
};

const LocationCard = ({
  title,
  subtitle,
  name,
  address,
  city,
  zipCode,
  onMap,
}: LocationCardProps) => {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50">
              <FiMapPin className="h-5 w-5 text-sky-600" />
            </div>

            <div>
              <Rb_Text className="text-sm font-semibold text-gray-900">
                {title}
              </Rb_Text>

              <Rb_Text className="text-xs text-gray-500">
                {subtitle}
              </Rb_Text>
            </div>
          </div>

          <button
            type="button"
            onClick={onMap}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-violet-50"
          >
            <FiMap className="h-3.5 w-3.5" />
            Open in Maps
          </button>
        </div>
      </div>

      <div className="p-5">
        <Rb_Text className="text-base font-semibold text-gray-900">
          {name}
        </Rb_Text>

        <Rb_Text className="mt-1 text-sm leading-6 text-gray-600">
          {address}
          {city && (
            <>
              <br />
              {city}
            </>
          )}

          {zipCode && (
            <>
              <br />
              {zipCode}
            </>
          )}
        </Rb_Text>
      </div>
    </div>
  );
};

// ============================================================
// LOCATION STATS
// ============================================================

type LocationStatsProps = {
  loading: boolean;
  distance: number | null;
  eta: number | null;
};

const LocationStats = ({
  loading,
  distance,
  eta,
}: LocationStatsProps) => {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <FiMapPin className="h-4 w-4 text-gray-400" />

          <Rb_Text className="text-xs font-medium text-gray-400">
            Distance
          </Rb_Text>
        </div>

        <div className="mt-1">
          {loading ? (
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
          ) : distance !== null ? (
            <Rb_Text className="text-base font-semibold text-gray-900">
              {distance.toFixed(1)} km
            </Rb_Text>
          ) : (
            <Rb_Text className="text-sm text-gray-500">
              Unavailable
            </Rb_Text>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <FiClock className="h-4 w-4 text-gray-400" />

          <Rb_Text className="text-xs font-medium text-gray-400">
            Estimated Time
          </Rb_Text>
        </div>

        <div className="mt-1">
          {loading ? (
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
          ) : eta !== null ? (
            <Rb_Text className="text-base font-semibold text-gray-900">
              {eta} mins
            </Rb_Text>
          ) : (
            <Rb_Text className="text-sm text-gray-500">
              Unavailable
            </Rb_Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentPickDetails;

