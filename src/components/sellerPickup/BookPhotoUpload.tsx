import { useState } from "react";
import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { type RequiredPhotoType, type RequiredPhotos } from "../../Types/pickup";
import RequiredPhotosSection from "./RequiredPhotosSection";
import DamagePhotoSection from "./DamagePhotoSection";


interface BookPhotoUploadProps {
  onChange?: (data: { requiredPhotos: RequiredPhotos; damagePhotos: File[] }) => void;
}

const BookPhotoUpload = ({ onChange }: BookPhotoUploadProps) => {
  const [requiredPhotos, setRequiredPhotos] = useState<RequiredPhotos>({
    front: null,
    back: null,
    spine: null,
  });

  const [hasDamage, setHasDamage] = useState(false);
  const [damagePhotos, setDamagePhotos] = useState<File[]>([]);

  const emitChange = (next: RequiredPhotos, damage: File[]) => {
    onChange?.({ requiredPhotos: next, damagePhotos: damage });
  };


  const handleRequiredPhotoSelected = (slot: RequiredPhotoType, file: File) => {
    const next = { ...requiredPhotos, [slot]: file };
    setRequiredPhotos(next);
    emitChange(next, damagePhotos);
  };

  const handleRequiredPhotoRemoved = (slot: RequiredPhotoType) => {
    const next = { ...requiredPhotos, [slot]: null };
    setRequiredPhotos(next);
    emitChange(next, damagePhotos);
  };

  const handleDamagePhotosAdded = (files: FileList) => {
    const next = [...damagePhotos, ...Array.from(files)];
    setDamagePhotos(next);
    emitChange(requiredPhotos, next);
  };

  const handleDamagePhotoRemoved = (index: number) => {
    const next = damagePhotos.filter((_, i) => i !== index);
    setDamagePhotos(next);
    emitChange(requiredPhotos, next);
  };

  const toggleDamage = () => {
    const next = !hasDamage;
    setHasDamage(next);

    if (!next) {
      setDamagePhotos([]);
      emitChange(requiredPhotos, []);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Rb_Text className="text-xl font-semibold">Book Verification Images</Rb_Text>

      <Rb_Text className="mt-2 text-sm text-gray-500">
        Capture clear images before collecting the book from the seller. Upload{" "}
        <span className="font-semibold">Front</span>,{" "}
        <span className="font-semibold">Back</span> and{" "}
        <span className="font-semibold">Spine</span>. If the book has any
        damage, report it below and upload photos of the damage.
      </Rb_Text>

      <RequiredPhotosSection
        requiredPhotos={requiredPhotos}
        onPhotoSelected={handleRequiredPhotoSelected}
        onPhotoRemoved={handleRequiredPhotoRemoved}
      />

      <DamagePhotoSection
        hasDamage={hasDamage}
        damagePhotos={damagePhotos}
        onToggleDamage={toggleDamage}
        onPhotosAdded={handleDamagePhotosAdded}
        onPhotoRemoved={handleDamagePhotoRemoved}
      />
    </div>
  );
};

export default BookPhotoUpload;