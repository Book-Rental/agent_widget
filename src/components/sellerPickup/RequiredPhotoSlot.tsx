import { FiCamera, FiCheck, FiTrash2 } from "react-icons/fi";
import { Rb_Image, Rb_Text } from "@rentbook/rentbook-ui-lib";
import { RequiredPhotoType } from "../../Types/pickup";


interface RequiredPhotoSlotProps {
  slotKey: RequiredPhotoType;
  label: string;
  hint: string;
  file: File | null;
  onPick: (slot: RequiredPhotoType) => void;
  onRemove: (slot: RequiredPhotoType) => void;
}

const RequiredPhotoSlot = ({
  slotKey,
  label,
  hint,
  file,
  onPick,
  onRemove,
}: RequiredPhotoSlotProps) => {
  if (!file) {
    return (
      <div
        onClick={() => onPick(slotKey)}
        className="cursor-pointer rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 p-6 text-center transition hover:bg-violet-100"
      >
        <FiCamera size={32} className="mx-auto text-blue-600" />
        <Rb_Text className="mt-3 text-sm font-semibold text-blue-600">
          {label}
        </Rb_Text>
        <Rb_Text className="mt-1 text-xs text-gray-400">{hint}</Rb_Text>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
      <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
        <FiCheck size={12} />
        {label}
      </div>

      <button
        type="button"
        onClick={() => onRemove(slotKey)}
        className="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
      >
        <FiTrash2 size={14} />
      </button>

      <Rb_Image
        src={URL.createObjectURL(file)}
        alt={label}
        className="h-40 w-full rounded-lg object-cover"
      />

      <Rb_Text
        onClick={() => onPick(slotKey)}
        className="mt-2 cursor-pointer text-center text-xs font-medium text-blue-600 hover:underline"
      >
        Retake
      </Rb_Text>
    </div>
  );
};

export default RequiredPhotoSlot;