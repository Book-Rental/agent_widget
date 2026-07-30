import { Rb_Button } from "@rentbook/rentbook-ui-lib";
import BookCondition from "../components/sellerPickup/BookCondition";
import BookPhotoUpload from "../components/sellerPickup/BookPhotoUpload";
import PickupBookInfo from "../components/sellerPickup/PickupBookInfo";
import { PickupDetails } from "../types/pickup";
import ReferencePhotosSection from "../components/sellerPickup/ReferencePhotosSection";

interface PickupVerificationProps {
  pickup: PickupDetails;
}


const PickupVerification = ( { pickup }: PickupVerificationProps) => {
  const isReturnPickup = pickup.pickupType === "RETURN_PICKUP";
  const handleProceed = () => {
    console.log("Proceed with Pickup", pickup.pickupType);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <PickupBookInfo pickup={pickup} />
      {isReturnPickup && pickup.referencePhotos && (
        <ReferencePhotosSection referencePhotos={pickup.referencePhotos} />
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