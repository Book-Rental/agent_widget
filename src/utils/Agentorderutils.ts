import type { AgentOrder } from "../Types/AgentTypes";

export const formatOrderDate = (date?: string) => {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getOrderNumber = (order: AgentOrder) =>
  order.orderNumber?.replace(/^ORD/, "").slice(-6) ?? "";

export const getJourneyLabel = (order: AgentOrder): string => {
  const { journeyType, shipmentType } = order;

  if (journeyType === "Pickup") {
    return shipmentType === "Forward"
      ? "Pickup from Seller"
      : "Pickup from User";
  }

  if (journeyType === "Delivery") {
    return shipmentType === "Forward"
      ? "Delivery to User"
      : "Delivery to Seller";
  }

  return "";
};