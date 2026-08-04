import { useState } from "react";
import { Rb_Button, Rb_LoadingSpinner, Rb_Text } from "@rentbook/rentbook-ui-lib";
import { useShipment } from "../hooks/useShipment";
import BookPhotoUpload from "../components/sellerPickup/BookPhotoUpload";

interface PickupVerificationProps {
  shipmentId: string;
}

const PickupVerification = ({
  shipmentId,
}: PickupVerificationProps) => {
  const [photosComplete, setPhotosComplete] = useState(false);
  const [conditionSelected , setConditionSelected ] = useState(false);
  const {
    data,
    isLoading,
    isError,
    error,
  } = useShipment(shipmentId);

  const shipment = data?.data;

  if (isLoading) {
    return <Rb_LoadingSpinner/>;
  }

  if (isError || !shipment) {
    return (
      <div>
        Error loading shipment.
        {error instanceof Error && (
          <p>{error.message}</p>
        )}
      </div>
    );
  }

  const isReturnPickup =
    shipment.shipmentType === "Return";

  const handleProceed = () => {
    console.log("Shipment:", shipment);

    window.history.pushState(
      {},
      "",
      `/agent/pickup-orders/${shipment.shipmentId}/confirmation`
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  return (
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

      {/* Shipment Information */}
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

      {/* Waiting for Order API */}
      {/* <PickupBookInfo /> */}

      {/* Waiting for Reference Photos API */}
      {/* <ReferencePhotosSection /> */}

      <BookPhotoUpload
        onChange={(data) =>
          setPhotosComplete(data.isComplete)
        }
      />

      {/* <BookCondition /> */}

      <div className="flex justify-end pt-2">
        <Rb_Button
          variant="primary"
          onClick={handleProceed}
          disabled={!photosComplete}
          className="min-w-[200px]"
        >
          Proceed with Pickup
        </Rb_Button>
      </div>
    </div>
  );
};

export default PickupVerification;