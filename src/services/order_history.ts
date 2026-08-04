import { AgentOrder, ShipmentApi } from "../Types/AgentTypes";

const API_URL = import.meta.env.VITE_API_URL;
export const getAgentOrders = async (
  agentId: string
): Promise<AgentOrder[]> => {
  const response = await fetch(
    `${API_URL}/api/shipment/agent/${agentId}`
  );

  const result = await response.json();
console.log("API Response", result);
console.log("result.data", result.data);
console.log("result.data.shipments", result?.data?.shipments);
const statusMap: Record<
 string,
 AgentOrder["orderStatus"]
> = {

 "Ready For Pickup":
   "Ready For Pickup",

 "Pickup Assigned":
   "Pickup Assigned",

 "Out For Pickup":
   "Out For Pickup",

 "Pickup Completed":
   "Pickup Completed",

 "Arrived At Origin Hub":
   "Arrived At Origin Hub",

 "Sorting Completed":
   "Sorting Completed",

 "Delivery Agent Assigned":
   "Delivery Agent Assigned",

 "Out For Delivery":
   "Out For Delivery",

 "Delivered":
   "Delivered",

 "Delivery Failed":
   "Delivery Failed",

 "Return Initiated":
   "Return Initiated",

 Returned:
   "Returned",

 Cancelled:
   "Cancelled",
};

  return result.data.shipments.map((shipment:ShipmentApi ) => ({
    shipmentId: shipment._id,
    orderNumber: shipment.awbNumber,

    orderStatus:
      statusMap[shipment.currentStatus] ?? "Assigned",

    deliveryType: "SELLER_TO_HUB",

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

    assignedDate: shipment.createdAt,

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
      hubId: shipment.originHubId._id,
      name: shipment.originHubId.hubName,
      address: shipment.originHubId.hubCode,
      city: shipment.sender.city,
    },
  }));
};