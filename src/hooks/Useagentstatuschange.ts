import { useUpdateShipmentStatus } from "./useUpdateShipmentStatus";
import { STATUS_CONFIG } from "../constants/shipmentStatus";
import type {
  AgentOrder,
  OrderStatus,
} from "../Types/AgentTypes";


export const useAgentStatusChange = (
  agentId:string
) => {

  const {
    mutate: updateStatus,
    isPending,
  } = useUpdateShipmentStatus();


  const onStatusChange = (
    order: AgentOrder,
    status: OrderStatus
  ) => {

    if(!order.shipmentId) return;


    updateStatus({
      shipmentId: order.shipmentId,

      payload:{
        status,
        event: STATUS_CONFIG[status]!.event,
        remarks: STATUS_CONFIG[status]!.remarks,
        agentId,
        updatedBy:agentId,
      }
    });

  };


  return {
    onStatusChange,
    isPending,
  };
};