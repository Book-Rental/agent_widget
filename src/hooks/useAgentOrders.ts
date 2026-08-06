import { useQuery } from "@tanstack/react-query";
import { getAgentOrders } from "../services/order_history";

export const useAgentOrders = (agentId: string,  page: number) => {
  return useQuery({
    queryKey: ["agent-orders", agentId, page],
    queryFn: () => getAgentOrders(agentId, page),
    enabled: !!agentId,
  });
};