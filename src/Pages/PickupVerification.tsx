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
import { FiAlertCircle, FiMapPin } from "react-icons/fi";
import ReferencePhotosSection from "../components/sellerPickup/ReferencePhotosSection";
import { getJourneyLabel } from "../utils/Agentorderutils";
import { AgentOrder } from "../Types/AgentTypes";
// import { getJourneyLabel } from "../utils/Agentorderutils";

const staticReferencePhotos = {
  front: "https://placehold.co/600x800?text=Front+Cover",
  back: "https://placehold.co/600x800?text=Back+Cover",
  spine: "https://placehold.co/600x800?text=Spine",
  damagePhotos: [
    "https://placehold.co/600x800?text=Damage+Photo+1",
    "https://placehold.co/600x800?text=Damage+Photo+2",
  ],
};

const PickupVerification = () => {
  const pathname = window.location.pathname;

  const pathParts = pathname.split("/").filter(Boolean); // /agent/pickup-orders/:shipmentId/pickup-verification 
  const shipmentId = pathParts[2] ?? "";
  const [photosComplete, setPhotosComplete] = useState(false);
  const [conditionSelected, setConditionSelected] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // const agentId = "6a6b29dbf447531ecb351110";
  const agentId = window.HOST_USER_INFO?.referenceId ?? "";
  const { mutate: updateStatus, isPending: isUpdatingStatus, } = useUpdateShipmentStatus();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useShipment(shipmentId);

  const shipment = data?.data;
  console.log("shipment", data)
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
  const order = {
    shipmentType: shipment.shipmentType,
    journeyType: shipment.journeyType,
  } as AgentOrder;

  const labelMessage = getJourneyLabel(order);

  const handleProceed = () => {
    if (isUpdatingStatus) return;

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
            `/agent/pickup-orders/${shipmentId}/confirmation`
          );

          window.dispatchEvent(new PopStateEvent("popstate"));
        },
      }
    );
  };

  return (
    <>
      <div className="w-full space-y-4 px-2 pt-0 pb-6 sm:space-y-6 sm:px-0 sm:pt-0 sm:pb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {isReturnPickup
              ? "Return Pickup Verification"
              : "Seller Pickup Verification"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Verify the shipment before proceeding.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Rb_Text className="text-lg font-semibold">
              Shipment Details
            </Rb_Text>

            {labelMessage && (
              <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-600 ring-1 ring-slate-100">
                <FiMapPin className="h-4 w-4 shrink-0 text-slate-500" />
                <span>{labelMessage}</span>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <div>
              <Rb_Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Shipment ID
              </Rb_Text>
              <Rb_Text className="mt-1 break-all text-sm font-medium text-gray-800">
                {shipment.shipmentId}
              </Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Order ID
              </Rb_Text>
              <Rb_Text className="mt-1 break-all text-sm font-medium text-gray-800">
                {shipment.orderId}
              </Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
                AWB Number
              </Rb_Text>
              <Rb_Text className="mt-1 text-sm font-medium text-gray-800">
                {shipment.awbNumber}
              </Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Current Status
              </Rb_Text>
              <Rb_Text className="mt-1 text-sm font-medium text-gray-800">
                {shipment.currentStatus}
              </Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Assigned Agent
              </Rb_Text>
              <Rb_Text className="mt-1 text-sm font-medium text-gray-800">
                {shipment.assignedAgent?.fullName ?? "-"}
              </Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Sender
              </Rb_Text>
              <Rb_Text className="mt-1 text-sm font-medium text-gray-800">
                {shipment.sender?.name ?? "-"}
              </Rb_Text>
            </div>

            <div>
              <Rb_Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Receiver
              </Rb_Text>
              <Rb_Text className="mt-1 text-sm font-medium text-gray-800">
                {shipment.receiver?.name ?? "-"}
              </Rb_Text>
            </div>
          </div>
        </div>

        {shipment.shipmentType === "Return" && (
          <ReferencePhotosSection
            referencePhotos={staticReferencePhotos}
          />
        )}
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
        onClose={() => {
          if (!isUpdatingStatus) {
            setShowConfirmation(false);
          }
        }}
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
              disabled={isUpdatingStatus}
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Rb_Button>

            <Rb_Button
              variant="primary"
              disabled={isUpdatingStatus}
              onClick={handleProceed}
              className="min-w-[160px] !border-red-600 !bg-red-600 !text-white hover:!bg-red-700"
            >
              {isUpdatingStatus ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Updating...
                </span>
              ) : (
                "Confirm Pickup"
              )}
            </Rb_Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PickupVerification;