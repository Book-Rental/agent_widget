import { useMutation } from "@tanstack/react-query";
import { bulkUpdateShipmentStatus } from "../services/shipmentService";
import type { BulkUpdateShipmentPayload } from "../services/shipmentService";

export const useBulkUpdateShipmentStatus = () => {
  return useMutation({
    mutationFn: (payload: BulkUpdateShipmentPayload) =>
      bulkUpdateShipmentStatus(payload),
  });
};