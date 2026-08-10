import type {
  AgentOrder,
  OrderStatus,
  ShipmentApi,
} from "../Types/AgentTypes";

type AgentOrdersResponse = {
  orders: AgentOrder[];
  meta: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasMore: boolean;
  };
   counts: {
  totalCount: number;
  [key: string]: number | undefined;
};
};

const API_URL = import.meta.env.VITE_API_URL;

const statusMap: Record<
  string,
  OrderStatus
> = {
  Created: "Created",
  "Ready For Pickup": "Ready For Pickup",
  "Pickup Assigned": "Pickup Assigned",
  "Out For Pickup": "Out For Pickup",
  "Pickup Completed": "Pickup Completed",
  "Arrived At Origin Hub": "Arrived At Origin Hub",
  "Sorting Completed": "Sorting Completed",
  "In Transit": "In Transit",
  "Arrived At Destination Hub":
    "Arrived At Destination Hub",
  "Delivery Agent Assigned":
    "Delivery Agent Assigned",
  "Out For Delivery": "Out For Delivery",
  Delivered: "Delivered",
  "Delivery Failed": "Delivery Failed",
  "Return Initiated": "Return Initiated",
  Returned: "Returned",
  Cancelled: "Cancelled",
};

export const getAgentOrders = async (
  agentId: string,
  journeyType: "Pickup" | "Delivery",
  page = 1,
  limit = 10,
  currentStatus?: OrderStatus
): Promise<AgentOrdersResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    JourneyType: journeyType,
  });

  if (currentStatus) {
    params.set("currentStatus", currentStatus);
  }

  const response = await fetch(
    `${API_URL}/api/shipment/agent/${agentId}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch agent orders");
  }

  const result = await response.json();

  const shipments = result.data?.shipments ?? [];

  const orders: AgentOrder[] = shipments.map(
    (
      shipment: ShipmentApi & {
        journeyType?: "Pickup" | "Delivery";
      }
    ) => {
      const isDelivery =
        (shipment.journeyType ?? journeyType) ===
        "Delivery";

      const orderStatus =
        statusMap[shipment.currentStatus] ??
        "Created";

      return {

        shipmentId:
          shipment.shipmentId || shipment._id,

        awbNumber: shipment.awbNumber,

        orderId: shipment.orderId,

        orderNumber: shipment.awbNumber,

        orderDate: shipment.createdAt,

        shipmentType:
          shipment.shipmentType ?? "Forward",

        deliveryType: isDelivery
          ? "HUB_TO_USER"
          : "SELLER_TO_HUB",

        orderStatus,

        assignedDate: shipment.createdAt,
        items: [
          {
            bookId:
              shipment.orderDetails.orderItem.bookId,

            bookName:
              shipment.orderDetails.orderItem.bookName,

            author:
              shipment.orderDetails.orderItem.author,

            coverImage:
              shipment.orderDetails.orderItem.coverImage,

            quantity:
              shipment.orderDetails.orderItem.quantity,
          },
        ],

        ...(isDelivery &&
        shipment.receiver
          ? {
              userDetails: {
                userId:
                  shipment.buyerId ?? "",

                name:
                  shipment.receiver.name,

                phoneNumber:
                  shipment.receiver.phone,

                address: {
                  name:
                    shipment.receiver.name,

                  type: "Receiver",

                  street:
                    shipment.receiver.addressLine1,

                  city:
                    shipment.receiver.city,

                  state:
                    shipment.receiver.state,

                  zipCode:
                    shipment.receiver.pincode,

                  country:
                    shipment.receiver.country,

                  phone:
                    shipment.receiver.phone,

                  location:
                    shipment.receiver.location,
                },
              },
            }
          : {}),


        ...(!isDelivery
          ? {
              sellerDetails: {
                sellerId:
                  shipment.sellerId,

                name:
                  shipment.sender.name,

                phoneNumber:
                  shipment.sender.phone,

                address: {
                  name:
                    shipment.sender.name,

                  type: "Seller",

                  street:
                    shipment.sender.addressLine1,

                  city:
                    shipment.sender.city,

                  state:
                    shipment.sender.state,

                  zipCode:
                    shipment.sender.pincode,

                  country:
                    shipment.sender.country,

                  phone:
                    shipment.sender.phone,

                  location:
                    shipment.sender.location,
                },
              },
            }
          : {}),
        ...(shipment.infrastructure?.originHub
          ? {
              hubDetails: {
                hubId:
                  shipment.infrastructure
                    .originHub._id,

                name:
                  shipment.infrastructure
                    .originHub.hubName,

                address:
                  shipment.infrastructure
                    .originHub.address.street,

                city:
                  shipment.infrastructure
                    .originHub.address.city,

                state:
                  shipment.infrastructure
                    .originHub.address.state,

                pincode:
                  shipment.infrastructure
                    .originHub.address.pincode,

                country:
                  shipment.infrastructure
                    .originHub.address.country,

                phoneNumber:
                  shipment.infrastructure
                    .originHub.phoneNumber,

                hubCode:
                  shipment.infrastructure
                    .originHub.hubCode,
              },
            }
          : {}),

        ...(shipment.infrastructure
          ?.destinationHub
          ? {
              destinationHubDetails: {
                hubId:
                  shipment.infrastructure
                    .destinationHub._id,

                name:
                  shipment.infrastructure
                    .destinationHub.hubName,

                address:
                  shipment.infrastructure
                    .destinationHub.address.street,

                city:
                  shipment.infrastructure
                    .destinationHub.address.city,

                state:
                  shipment.infrastructure
                    .destinationHub.address.state,

                pincode:
                  shipment.infrastructure
                    .destinationHub.address.pincode,

                country:
                  shipment.infrastructure
                    .destinationHub.address.country,

                phoneNumber:
                  shipment.infrastructure
                    .destinationHub.phoneNumber,

                hubCode:
                  shipment.infrastructure
                    .destinationHub.hubCode,
              },
            }
          : {}),

        journeyHistory:
          shipment.journeyHistory ?? [],
      };
    }
  );

  return {
    orders,
    meta: result.data.meta,
    counts: result.data.counts
  };
};