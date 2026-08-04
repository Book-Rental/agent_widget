import { useQuery } from "@tanstack/react-query";
import { getAgentOrders } from "../services/order_history";

export const useAgentOrders = (agentId: string) => {
  return useQuery({
    queryKey: ["agent-orders", agentId],
    queryFn: () => getAgentOrders(agentId),
    enabled: !!agentId,
  });
};