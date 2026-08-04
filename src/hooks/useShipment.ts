import { useQuery } from "@tanstack/react-query";
import { getShipment } from "../services/shipmentService";

export const useShipment = (shipmentId: string) => {
  return useQuery({
    queryKey: ["shipment", shipmentId],
    queryFn: () => getShipment(shipmentId),
    enabled: !!shipmentId,
  });
};