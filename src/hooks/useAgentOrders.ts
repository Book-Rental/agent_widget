import { useQuery } from "@tanstack/react-query";
import { getAgentOrders } from "../services/order_history";
import type { OrderStatus } from "../Types/AgentTypes";

export const useAgentOrders = (
  agentId: string,
  journeyType: "Pickup" | "Delivery",
  page = 1,
  currentStatus?: OrderStatus
) => {
  return useQuery({
    queryKey: ["agent-orders", agentId, journeyType, page, currentStatus ?? "all"],
    queryFn: () => getAgentOrders(agentId, journeyType, page, 10, currentStatus),
    enabled: !!agentId,
  });
};