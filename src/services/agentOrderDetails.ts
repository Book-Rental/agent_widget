import type { AgentOrder, JourneyHistory } from "../Types/AgentTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const getAgentOrderDetails = async (
  shipmentId: string
): Promise<AgentOrder> => {

  const response = await fetch(
    `${API_URL}/api/shipment/${shipmentId}`
  );

  const result = await response.json();

  const shipment = result.data;


  const statusMap: Record<
    string,
    AgentOrder["orderStatus"]
  > = {

    "Ready For Pickup":
      "Ready For Pickup",

    "Pickup Assigned":
      "Pickup Assigned",

    "Out for Pickup":
      "Out For Pickup",

    "Out For Pickup":
      "Out For Pickup",

    "Pickup Successful":
      "Pickup Completed",

    "Pickup Completed":
      "Pickup Completed",

    "Submitted to Admin":
      "Sorting Completed",

    "Sorting Completed":
      "Sorting Completed",

    "Assigned for Delivery":
      "Delivery Agent Assigned",

    "Delivery Agent Assigned":
      "Delivery Agent Assigned",

    "Out for Delivery":
      "Out For Delivery",

    "Out For Delivery":
      "Out For Delivery",

    Delivered:
      "Delivered",
  };

return {

   shipmentId: shipment.shipmentId,                 
    orderId: shipment.orderId,               
    orderNumber: shipment.awbNumber ?? shipment.orderId, 

  orderDate: shipment.createdAt,  
  shipmentType: shipment.shipmentType ?? "Standard", 

  orderStatus:
    statusMap[shipment.currentStatus] ?? "Assigned",

  deliveryType: "SELLER_TO_HUB",

  assignedDate: shipment.createdAt,

  pickupStartedDate: shipment.pickupStartedAt,
  pickupDate: shipment.pickupCompletedAt,
  completedDate: shipment.completedAt,

  items: [
    {
      bookId: shipment.orderDetails.orderItem.bookId,
      bookName: shipment.orderDetails.orderItem.bookName,
      author: shipment.orderDetails.orderItem.author,
      coverImage: shipment.orderDetails.orderItem.coverImage,
      quantity: shipment.orderDetails.orderItem.quantity,
    },
  ],

    journeyHistory: shipment.journeyHistory.map((item: JourneyHistory) => ({
  event: item.event,
  status: item.status,
  eventAt: item.eventAt,
  remarks: item.remarks,
})),

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

  hubDetails: {
    hubId: shipment.infrastructure.originHub._id,
    name: shipment.infrastructure.originHub.hubName,
    address: shipment.infrastructure.originHub.address.street,
    city: shipment.infrastructure.originHub.address.city,
    state: shipment.infrastructure.originHub.address.state,
  },
};
};