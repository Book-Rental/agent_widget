import { useQuery } from "@tanstack/react-query";
import { getAgentOrderDetails } from "../services/agentOrderDetails";


export const useAgentOrderDetails = (
  shipmentId?: string
) => {

  return useQuery({
    queryKey: ["agentOrderDetails", shipmentId],

    queryFn: () =>
      getAgentOrderDetails(shipmentId!),

    enabled: !!shipmentId,
  });

};