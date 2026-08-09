import type {
  AgentOrder,
  JourneyHistory,
  OrderStatus,
} from "../Types/AgentTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const getAgentOrderDetails = async (
  shipmentId: string
): Promise<AgentOrder> => {
  const response = await fetch(
    `${API_URL}/api/shipment/${shipmentId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipment");
  }

  const result = await response.json();
  const shipment = result.data;

  const statusMap: Record<string, OrderStatus> = {
    Created: "Created",

    "Ready For Pickup": "Ready For Pickup",

    "Pickup Assigned": "Pickup Assigned",

    "Out for Pickup": "Out For Pickup",
    "Out For Pickup": "Out For Pickup",

    "Pickup Successful": "Pickup Completed",
    "Pickup Completed": "Pickup Completed",

    "Arrived At Hub": "Arrived At Origin Hub",
    "Arrived At Origin Hub": "Arrived At Origin Hub",

    "Submitted to Admin": "Sorting Completed",
    "Sorting Completed": "Sorting Completed",

    "Added To Trip": "In Transit",
    "In Transit": "In Transit",

    "Trip Completed": "Arrived At Destination Hub",
    "Arrived At Destination Hub":
      "Arrived At Destination Hub",

    "Assigned for Delivery": "Delivery Agent Assigned",
    "Delivery Agent Assigned":
      "Delivery Agent Assigned",

    "Out for Delivery": "Out For Delivery",
    "Out For Delivery": "Out For Delivery",

    Delivered: "Delivered",

    "Delivery Failed": "Delivery Failed",
    "Return Initiated": "Return Initiated",
    Returned: "Returned",
    Cancelled: "Cancelled",
  };

  const orderStatus =
    statusMap[shipment.currentStatus] ?? "Created";

  const mapJourneyHistory = (
    history: JourneyHistory[]
  ): JourneyHistory[] => {
    return history.map((item) => ({
      event: item.event,
      status:
        statusMap[item.status] ?? item.status,
      eventAt: item.eventAt,
      remarks: item.remarks,
      hubId: item.hubId,
      tripId: item.tripId,
      agentId: item.agentId,
      updatedBy: item.updatedBy,
    }));
  };

  const originHub =
    shipment.infrastructure?.originHub;

  const destinationHub =
    shipment.infrastructure?.destinationHub;

  const receiver = shipment.receiver;

  return {
    shipmentId: shipment.shipmentId,
    awbNumber: shipment.awbNumber,
    orderId: shipment.orderId,
    orderNumber:
      shipment.awbNumber ?? shipment.orderId,
    orderDate: shipment.createdAt,
    shipmentType:
      shipment.shipmentType ?? "Forward",
    deliveryType: "SELLER_TO_HUB",
    orderStatus,
    assignedDate: shipment.createdAt,
    pickupStartedDate:
      shipment.pickupStartedAt,
    pickupDate:
      shipment.pickupCompletedAt,
    completedDate:
      shipment.completedAt,
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

    journeyHistory:
      mapJourneyHistory(
        shipment.journeyHistory ?? []
      ),

    sellerDetails: {
      sellerId: shipment.sellerId,
      name: shipment.sender.name,
      phoneNumber: shipment.sender.phone,
      address: {
        name: shipment.sender.name,
        type: "Seller",
        street: shipment.sender.addressLine1,
        city: shipment.sender.city,
        state: shipment.sender.state,
        zipCode: shipment.sender.pincode,
        country: shipment.sender.country,
        phone: shipment.sender.phone,
        location:
          shipment.sender.location,
      },
    },

    hubDetails: originHub
      ? {
          hubId: originHub._id,
          name: originHub.hubName,
          address:
            originHub.address.street,
          city:
            originHub.address.city,
          state:
            originHub.address.state,
          pincode:
            originHub.address.pincode,
          country:
            originHub.address.country,
          phoneNumber:
            originHub.phoneNumber,
          hubCode:
            originHub.hubCode,
          location: undefined,
        }
      : undefined,

    destinationHubDetails:
      destinationHub
        ? {
            hubId: destinationHub._id,
            name: destinationHub.hubName,
            address:
             destinationHub.address.street,
            city:
              destinationHub.address.city,
            state:
              destinationHub.address.state,
            pincode:
              destinationHub.address.pincode,
            country:
              destinationHub.address.country,
            phoneNumber:
              destinationHub.phoneNumber,
            hubCode:
              destinationHub.hubCode,
            location: undefined,
          }
        : undefined,

    userDetails: receiver
      ? {
          userId: shipment.buyerId ?? "",
          name: receiver.name,
          phoneNumber: receiver.phone,
          address: {
            name: receiver.name,
            type: "Receiver",
            street:
              receiver.addressLine1,
            city: receiver.city,
            state: receiver.state,
            zipCode: receiver.pincode,
            country: receiver.country,
            phone: receiver.phone,
            location:
              receiver.location,
          },
        }
      : undefined,
  };
};