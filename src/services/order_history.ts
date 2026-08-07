import { AgentOrder, OrderStatus, ShipmentApi } from "../Types/AgentTypes";

type AgentOrdersResponse = {
  orders: AgentOrder[];
  meta: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasMore: boolean;
  };
};

const API_URL = import.meta.env.VITE_API_URL;

const statusMap: Record<string, AgentOrder["orderStatus"]> = {
  "Ready For Pickup": "Ready For Pickup",
  "Pickup Assigned": "Pickup Assigned",
  "Out For Pickup": "Out For Pickup",
  "Pickup Completed": "Pickup Completed",
  "Arrived At Origin Hub": "Arrived At Origin Hub",
  "Sorting Completed": "Sorting Completed",
  "In Transit": "In Transit",
  "Arrived At Destination Hub": "Arrived At Destination Hub",
  "Delivery Agent Assigned": "Delivery Agent Assigned",
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

  const result = await response.json();

  const orders: AgentOrder[] = result.data.shipments.map(
    (shipment: ShipmentApi & { journeyType?: "Pickup" | "Delivery"; receiver?: ShipmentApi["sender"] }) => {
      const isDelivery = (shipment.journeyType ?? journeyType) === "Delivery";

      return {
        shipmentId: shipment._id,
        orderNumber: shipment.awbNumber,
        orderStatus: statusMap[shipment.currentStatus] ?? "Assigned",
        deliveryType: isDelivery ? "HUB_TO_USER" : "SELLER_TO_HUB",

        items: [
          {
            bookId: shipment.orderDetails.orderItem.bookId,
            bookName: shipment.orderDetails.orderItem.bookName,
            author: shipment.orderDetails.orderItem.author,
            coverImage: shipment.orderDetails.orderItem.coverImage,
            quantity: shipment.orderDetails.orderItem.quantity,
          },
        ],

        assignedDate: shipment.createdAt,

        ...(isDelivery
          ? {
              userDetails: shipment.receiver && {
                userId: shipment.sellerId ?? "",
                name: shipment.receiver.name,
                phoneNumber: shipment.receiver.phone,
                address: {
                  name: shipment.receiver.name,
                  type: "Home",
                  street: shipment.receiver.addressLine1,
                  city: shipment.receiver.city,
                  state: shipment.receiver.state,
                  zipCode: shipment.receiver.pincode,
                  country: shipment.receiver.country,
                  phone: shipment.receiver.phone,
                },
              },
            }
          : {
              sellerDetails: {
                sellerId: shipment.sellerId,
                name: shipment.sender.name,
                phoneNumber: shipment.sender.phone,
                address: {
                  name: shipment.sender.name,
                  type: "Home",
                  street: shipment.sender.addressLine1,
                  city: shipment.sender.city,
                  state: shipment.sender.state,
                  zipCode: shipment.sender.pincode,
                  country: shipment.sender.country,
                  phone: shipment.sender.phone,
                },
              },
            }),

        hubDetails: {
          hubId: shipment.originHubId._id,
          name: shipment.originHubId.hubName,
          address: shipment.originHubId.hubCode,
          city: shipment.sender.city,
        },
      };
    }
  );

  return {
    orders,
    meta: result.data.meta,
  };
};