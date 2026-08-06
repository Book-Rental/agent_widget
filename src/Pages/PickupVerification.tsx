import { useState } from "react";
import {
  Rb_Button,
  Rb_LoadingSpinner,
  Rb_Text,
  Modal,
} from "@rentbook/rentbook-ui-lib";

import { useShipment } from "../hooks/useShipment";
import { useUpdateShipmentStatus } from "../hooks/useUpdateShipmentStatus";
import { STATUS_CONFIG } from "../constants/shipmentStatus";

import BookCondition from "../components/sellerPickup/BookCondition";
import BookPhotoUpload from "../components/sellerPickup/BookPhotoUpload";
import { FiAlertCircle } from "react-icons/fi";

interface PickupVerificationProps {
  shipmentId: string;
}

const PickupVerification = ({
  shipmentId,
}: PickupVerificationProps) => {
  const [photosComplete, setPhotosComplete] = useState(false);
  const [conditionSelected, setConditionSelected] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const agentId = "6a6b29dbf447531ecb351110";
// const agentId = window.HOST_USER_INFO?._id ?? "";
  const { mutate: updateStatus } = useUpdateShipmentStatus();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useShipment(shipmentId);

  const shipment = data?.data;

  if (isLoading) {
    return <Rb_LoadingSpinner />;
  }

  if (isError || !shipment) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
  <FiAlertCircle className="text-3xl text-red-500" />
</div>
        </div>

        <Rb_Text className="text-xl font-semibold text-gray-900">
          Unable to Load Shipment
        </Rb_Text>

        <Rb_Text className="mt-2 text-sm text-gray-500">
          We couldn't fetch the shipment details at the moment.
        </Rb_Text>

        {error instanceof Error && (
          <Rb_Text className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error.message}
          </Rb_Text>
        )}

        <div className="mt-6">
          <Rb_Button
            variant="primary"
            onClick={() => window.location.reload()}
          >Try Again</Rb_Button>
        </div>
      </div>
    </div>
  );
}

  const isReturnPickup = shipment.shipmentType === "Return";

  const handleProceed = () => {
    updateStatus(
      {
        shipmentId: shipment.shipmentId,
        payload: {
          status: "Pickup Completed",
          event: STATUS_CONFIG["Pickup Completed"]!.event,
          remarks: STATUS_CONFIG["Pickup Completed"]!.remarks,
          agentId,
          updatedBy: agentId,
        },
      },
      {
        onSuccess: () => {
          setShowConfirmation(false);

          window.history.pushState(
            {},
            "",
            `/agent/pickup-orders/${shipment.shipmentId}/confirmation`
          );

          window.dispatchEvent(new PopStateEvent("popstate"));
        },
      }
    );
  };

  return (
    <>
      <div className="max-w-4xl space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isReturnPickup
              ? "Return Pickup Verification"
              : "Seller Pickup Verification"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Verify the shipment before proceeding.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <Rb_Text className="text-lg font-semibold">
            Shipment Details
          </Rb_Text>

          <div className="mt-4 space-y-3">
            <div>
              <Rb_Text className="text-xs text-gray-500">
                Shipment ID
              </Rb_Text>
              <Rb_Text>{shipment.shipmentId}</Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs text-gray-500">
                Order ID
              </Rb_Text>
              <Rb_Text>{shipment.orderId}</Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs text-gray-500">
                AWB Number
              </Rb_Text>
              <Rb_Text>{shipment.awbNumber}</Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs text-gray-500">
                Current Status
              </Rb_Text>
              <Rb_Text>{shipment.currentStatus}</Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs text-gray-500">
                Assigned Agent
              </Rb_Text>
              <Rb_Text>{shipment.assignedAgent.fullName}</Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs text-gray-500">
                Sender
              </Rb_Text>
              <Rb_Text>{shipment.sender.name}</Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs text-gray-500">
                Receiver
              </Rb_Text>
              <Rb_Text>{shipment.receiver.name}</Rb_Text>
            </div>
          </div>
        </div>

        <BookPhotoUpload
          onChange={(data) =>
            setPhotosComplete(data.isComplete)
          }
        />

        <BookCondition
          onConditionChange={(condition) =>
            setConditionSelected(condition !== null)
          }
        />

        <div className="flex justify-end pt-2">
          <Rb_Button
            variant="primary"
            onClick={() => setShowConfirmation(true)}
            disabled={!photosComplete || !conditionSelected}
            className="min-w-[200px]"
          >
            Proceed with Pickup
          </Rb_Button>
        </div>
      </div>
<Modal
  isOpen={showConfirmation}
  onClose={() => setShowConfirmation(false)}
>
  <div className="w-[480px] max-w-full p-6">
    <h2 className="text-xl font-semibold text-gray-900">
      Confirm Pickup
    </h2>

    <p className="mt-4 text-sm leading-6 text-gray-600">
      Are you sure you want to mark this shipment as{" "}
      <span className="font-semibold text-gray-900">
        Pickup Completed
      </span>
      ?
    </p>

    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
      <p className="text-sm font-medium text-red-600">
        ⚠️ This action cannot be undone.
      </p>
    </div>

    <div className="mt-6 flex justify-end gap-3">
      <Rb_Button
        variant="secondary"
        onClick={() => setShowConfirmation(false)}
      >
        Cancel
      </Rb_Button>

      <Rb_Button
        variant="primary"
        onClick={handleProceed}
        className="!border-red-600 !bg-red-600 !text-white hover:!bg-red-700"
      >
        Confirm Pickup
      </Rb_Button>
    </div>
  </div>
</Modal>
    </>
  );
};

export default PickupVerification;