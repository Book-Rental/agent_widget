import { useRef } from "react";
import { FiCamera, FiPlus, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { Rb_Button, Rb_Image, Rb_Text } from "@rentbook/rentbook-ui-lib";

interface DamagePhotoSectionProps {
  hasDamage: boolean;
  damagePhotos: File[];
  onToggleDamage: () => void;
  onPhotosAdded: (files: FileList) => void;
  onPhotoRemoved: (index: number) => void;
}

const DamagePhotoSection = ({
  hasDamage,
  damagePhotos,
  onToggleDamage,
  onPhotosAdded,
  onPhotoRemoved,
}: DamagePhotoSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    onPhotosAdded(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <Rb_Text className="text-sm font-semibold text-gray-700">Optional</Rb_Text>
          <Rb_Text className="mt-1 text-sm text-gray-500">
            Does this book have any visible damage?
          </Rb_Text>
        </div>

        <button
          type="button"
          onClick={onToggleDamage}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
            hasDamage
              ? "border-red-300 bg-red-50 text-red-600"
              : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FiAlertTriangle size={16} />
          {hasDamage ? "Damage Reported" : "Report Damage"}
        </button>
      </div>

      {hasDamage && (
        <div className="mt-4">
          <input
            hidden
            multiple
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files)}
          />

          <div
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-red-300 bg-red-50 p-6 text-center transition hover:bg-red-100"
          >
            <FiCamera size={32} className="mx-auto text-red-500" />
            <Rb_Text className="mt-2 text-sm font-semibold text-red-600">
              Upload Damage Photos
            </Rb_Text>
            <Rb_Text className="mt-1 text-xs text-gray-400">
              Click to browse or capture images (multiple allowed)
            </Rb_Text>
          </div>

          {damagePhotos.length > 0 && (
            <>
              <div className="mt-5 flex items-center justify-between">
                <Rb_Text className="text-sm font-semibold">
                  Damage Photos ({damagePhotos.length})
                </Rb_Text>
                <Rb_Button variant="secondary" onClick={() => inputRef.current?.click()}>
                  <FiPlus className="mr-2" />
                  Add More
                </Rb_Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {damagePhotos.map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => onPhotoRemoved(index)}
                      className="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <FiTrash2 size={14} />
                    </button>

                    <Rb_Image
                      src={URL.createObjectURL(image)}
                      alt={`Damage ${index + 1}`}
                      className="h-40 w-full rounded-lg object-cover"
                    />

                    <Rb_Text className="mt-2 truncate text-xs text-gray-500">
                      {image.name}
                    </Rb_Text>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DamagePhotoSection;