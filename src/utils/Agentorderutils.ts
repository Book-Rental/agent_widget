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