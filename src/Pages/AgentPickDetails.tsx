import { useEffect, useState } from "react";
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

type OrderStatus =
  | "Assigned"
  | "Out for Pickup"
  | "Unable to Pickup";

const AgentPickDetails = () => {
  const [distance, setDistance] = useState<number | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const [orderStatus, setOrderStatus] =
    useState<OrderStatus>("Assigned");

  const pickDetails = [
    {
      orderId: "6a688d51fee54ef848305cbe",
      orderNumber: "ORD1785236817175",

      bookDetails: {
        bookName: "Beloved",
        author: "Toni Morrison",
        quantity: 1,
        coverImage:
          "https://res.cloudinary.com/dlggszqj9/image/upload/v1782381739/BookImages/Beloved-cover.webp.jpg",
      },

      pickupContact: {
        name: "Test",
        phoneNumber: "1234567890",

        address: [
          {
            addressId: "Ad1",
            name: "Ambedkar Circle",
            street: "Navirman Nagar",
            city: "Hyderabad",
            state: "Telangana",
            zipCode: "500096",
            country: "India",
            phone: "4083285219",

            location: {
              type: "Point",
              coordinates: [
                78.39079811907578,
                17.450498410435817,
              ],
            },
          },
        ],
      },
    },
  ];

  const order = pickDetails[0];
  const pickupContact = order.pickupContact;
  const address = pickupContact.address[0];

  const calculateDistance = (
    agentLat: number,
    agentLng: number,
    pickupLat: number,
    pickupLng: number
  ) => {
    const earthRadius = 6371;

    const dLat = ((pickupLat - agentLat) * Math.PI) / 180;
    const dLng = ((pickupLng - agentLng) * Math.PI) / 180;

    const lat1 = (agentLat * Math.PI) / 180;
    const lat2 = (pickupLat * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLng / 2) ** 2;

    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const agentLat = position.coords.latitude;
        const agentLng = position.coords.longitude;

        const [pickupLng, pickupLat] =
          address.location.coordinates;

        const calculatedDistance = calculateDistance(
          agentLat,
          agentLng,
          pickupLat,
          pickupLng
        );

        setDistance(calculatedDistance);

        const estimatedMinutes = Math.ceil(
          (calculatedDistance / 30) * 60
        );

        setEta(estimatedMinutes);
        setLocationLoading(false);
      },
      (error) => {
        console.error(
          "Unable to get agent location:",
          error
        );

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  const handleStatusChange = (value: string) => {
    const newStatus = value as OrderStatus;

    setOrderStatus(newStatus);

    // Later replace this with API call
    console.log("Order status updated:", {
      orderId: order.orderId,
      status: newStatus,
    });
  };

  const goToMaps = () => {
    const [longitude, latitude] =
      address.location.coordinates;

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

  const callContact = () => {
    window.location.href = `tel:${pickupContact.phoneNumber}`;
  };

  const handleProceedToPickup = () => {
    console.log(
      "Proceed to pickup:",
      order.orderId
    );
  };

  const statusMeta = {
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
    "Unable to Pickup": {
      label: "Unable to Pickup",
      badge: "bg-red-50 text-red-700",
      dot: "bg-red-500",
    },
  };

  const meta = statusMeta[orderStatus];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Rb_Text className="text-xl font-semibold text-gray-900">
              Pickup Details
            </Rb_Text>

            <Rb_Text className="mt-1 text-sm text-gray-500">
              Order #
              {order.orderNumber.replace(/^ORD/, "")}
            </Rb_Text>
          </div>

          {/* Status */}
          {orderStatus === "Assigned" ? (
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
                value={orderStatus}
                onChange={handleStatusChange}
              />
            </div>
          ) : (
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${meta.badge}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
              />

              {meta.label}
            </span>
          )}
        </div>

        {/* Order Details */}
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
              src={order.bookDetails.coverImage}
              alt={order.bookDetails.bookName}
              className="h-24 w-[68px] shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
            />

            <div className="min-w-0">
              <Rb_Text className="text-base font-semibold text-gray-900">
                {order.bookDetails.bookName}
              </Rb_Text>

              <Rb_Text className="mt-1 text-sm text-gray-500">
                by {order.bookDetails.author}
              </Rb_Text>

              <span className="mt-3 inline-flex rounded-md bg-gray-50 px-2.5 py-1">
                <Rb_Text className="text-xs font-medium text-gray-600">
                  Quantity: {order.bookDetails.quantity}
                </Rb_Text>
              </span>
            </div>
          </div>
        </div>

        {/* Pickup Contact */}
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                <FiUser className="h-4 w-4 text-gray-600" />
              </div>

              <Rb_Text className="text-sm font-semibold text-gray-900">
                Pickup Contact
              </Rb_Text>
            </div>

            <button
              type="button"
              onClick={callContact}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              Call Contact
            </button>
          </div>

          <Rb_Text className="text-sm font-semibold text-gray-800">
            {pickupContact.name}
          </Rb_Text>

          <Rb_Text className="mt-1 text-sm text-gray-500">
            +91 {pickupContact.phoneNumber}
          </Rb_Text>
        </div>

        {/* Pickup Location */}
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
                    Pickup address
                  </Rb_Text>
                </div>
              </div>

              <button
                type="button"
                onClick={goToMaps}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              >
                <FiMap className="h-3.5 w-3.5" />
                Open in Maps
              </button>
            </div>
          </div>

          <div className="p-5">
            <Rb_Text className="text-sm font-semibold text-gray-900">
              {address.name}
            </Rb_Text>

            <Rb_Text className="mt-1 text-sm leading-6 text-gray-600">
              {address.street}
              <br />
              {address.city}, {address.state}
              <br />
              {address.zipCode}, {address.country}
            </Rb_Text>

            {/* Distance / ETA */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <FiMapPin className="h-4 w-4 text-gray-400" />

                  <Rb_Text className="text-xs font-medium text-gray-400">
                    Distance
                  </Rb_Text>
                </div>

                <div className="mt-1">
                  {locationLoading ? (
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
                  {locationLoading ? (
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
          </div>
        </div>

        {/* Pickup Process */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <Rb_Text className="text-sm font-semibold text-gray-900">
            Pickup Process
          </Rb_Text>

          <div className="mt-4 space-y-4">
            <div className="flex gap-3">
              <FiMapPin className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

              <div>
                <Rb_Text className="text-sm font-medium text-gray-800">
                  Reach pickup location
                </Rb_Text>

                <Rb_Text className="text-xs text-gray-500">
                  Navigate to the pickup address.
                </Rb_Text>
              </div>
            </div>

            <div className="flex gap-3">
              <FiBookOpen className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />

              <div>
                <Rb_Text className="text-sm font-medium text-gray-800">
                  Verify the book
                </Rb_Text>

                <Rb_Text className="text-xs text-gray-500">
                  Take photos and verify the book condition.
                </Rb_Text>
              </div>
            </div>

            <div className="flex gap-3">
              <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />

              <div>
                <Rb_Text className="text-sm font-medium text-gray-800">
                  Complete pickup
                </Rb_Text>

                <Rb_Text className="text-xs text-gray-500">
                  Confirm the pickup with the pickup contact.
                </Rb_Text>
              </div>
            </div>
          </div>
        </div>

        {/* Proceed to Pickup */}
        <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Rb_Text className="text-sm font-semibold text-gray-900">
                Ready to pickup?
              </Rb_Text>

              <Rb_Text className="mt-0.5 text-xs text-gray-500">
                Start the pickup verification process.
              </Rb_Text>
            </div>

            <Rb_Button
              variant="primary"
              className="flex shrink-0 items-center gap-2 px-4 py-2 text-sm"
              onClick={handleProceedToPickup}
            >
              Proceed to Pickup
              <FiArrowRight className="h-4 w-4" />
            </Rb_Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPickDetails;

