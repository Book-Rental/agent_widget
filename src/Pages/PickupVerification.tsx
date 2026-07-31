import { Rb_Button } from "@rentbook/rentbook-ui-lib";

import { PickupDetails } from "../Types/pickup";
import PickupBookInfo from "../Components/sellerPickup/PickupBookInfo";
import ReferencePhotosSection from "../Components/sellerPickup/ReferencePhotosSection";
import BookPhotoUpload from "../Components/sellerPickup/BookPhotoUpload";
import BookCondition from "../Components/sellerPickup/BookCondition";

interface PickupVerificationProps {
  pickup: PickupDetails;
}

const PickupVerification = ({ pickup }: PickupVerificationProps) => {
  const isReturnPickup = pickup.pickupType === "RETURN_PICKUP";

  const handleProceed = () => {
    console.log("Proceed with Pickup", pickup.pickupType);
     window.history.pushState(
      {},
      "",
      `/confirmation-page`
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isReturnPickup
            ? "Return Pickup Verification"
            : "Seller Pickup Verification"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Verify the book details, capture the required photos, and record the
          book condition before proceeding.
        </p>
      </div>

      <PickupBookInfo pickup={pickup} />

      {isReturnPickup && pickup.referencePhotos && (
        <ReferencePhotosSection
          referencePhotos={pickup.referencePhotos}
        />
      )}

      <BookPhotoUpload />
      <BookCondition />
      <div className="flex justify-end pt-2">
        <Rb_Button
          variant="primary"
          onClick={handleProceed}
          className="min-w-[200px]"
        >
          Proceed with Pickup
        </Rb_Button>
      </div>
    </div>
  );
};

export default PickupVerification;