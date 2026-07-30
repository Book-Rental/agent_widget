import { Rb_Image, Rb_Text } from "@rentbook/rentbook-ui-lib";
import type { ReferencePhotos } from "../../types/pickup";

interface ReferencePhotosSectionProps {
  referencePhotos: ReferencePhotos;
}

const REFERENCE_SLOTS: { key: "front" | "back" | "spine"; label: string }[] = [
  { key: "front", label: "Front Cover" },
  { key: "back", label: "Back Cover" },
  { key: "spine", label: "Spine" },
];

const ReferencePhotosSection = ({ referencePhotos }: ReferencePhotosSectionProps) => {
  const hasDamagePhotos =
    referencePhotos.damagePhotos && referencePhotos.damagePhotos.length > 0;

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Rb_Text className="text-xl font-semibold">Seller Uploaded Photos</Rb_Text>

      <Rb_Text className="mt-2 text-sm text-gray-500">
        These photos were captured at the time of pickup from the seller.
        Use them as reference to compare against the book's current condition.
      </Rb_Text>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {REFERENCE_SLOTS.map((slot) => (
          <div
            key={slot.key}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm"
          >
            <Rb_Image
              src={referencePhotos[slot.key]}
              alt={slot.label}
              className="h-40 w-full rounded-lg object-cover"
            />
            <Rb_Text className="mt-2 text-center text-xs font-medium text-gray-600">
              {slot.label}
            </Rb_Text>
          </div>
        ))}
      </div>

      {hasDamagePhotos && (
        <div className="mt-6 border-t border-gray-100 pt-5">
          <Rb_Text className="text-sm font-semibold text-gray-700">
            Damage Reported at Original Pickup
          </Rb_Text>

          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {referencePhotos.damagePhotos!.map((url, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm"
              >
                <Rb_Image
                  src={url}
                  alt={`Reported damage ${index + 1}`}
                  className="h-32 w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferencePhotosSection;