import { useRef } from "react";
import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import RequiredPhotoSlot from "./RequiredPhotoSlot";
import { RequiredPhotos, RequiredPhotoType, REQUIRED_SLOTS } from "../../Types/pickup";

interface RequiredPhotosSectionProps {
  requiredPhotos: RequiredPhotos;
  onPhotoSelected: (slot: RequiredPhotoType, file: File) => void;
  onPhotoRemoved: (slot: RequiredPhotoType) => void;
}

const RequiredPhotosSection = ({
  requiredPhotos,
  onPhotoSelected,
  onPhotoRemoved,
}: RequiredPhotosSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const activeSlotRef = useRef<RequiredPhotoType | null>(null);

  const openPicker = (slot: RequiredPhotoType) => {
    activeSlotRef.current = slot;
    inputRef.current?.click();
  };

  const handleFileChange = (files: FileList | null) => {
    const slot = activeSlotRef.current;
    if (!files || !files[0] || !slot) return;

    onPhotoSelected(slot, files[0]);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mt-6">
      <Rb_Text className="text-sm font-semibold text-gray-700">Required</Rb_Text>

      <input
        hidden
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
      />

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {REQUIRED_SLOTS.map((slot) => (
           <RequiredPhotoSlot
            key={slot.key}
            slotKey={slot.key}
            label={slot.label}
            hint={slot.hint}
            file={requiredPhotos[slot.key]}
            onPick={openPicker}
            onRemove={onPhotoRemoved}
          />
        ))}
      </div>
    </div>
  );
};

export default RequiredPhotosSection;