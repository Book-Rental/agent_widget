import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { FiPhone, FiUser } from "react-icons/fi";

type Props = {
  title: string;
  name: string;
  phone?: string;
  onCall: () => void;
};

export default function ContactCard({
  title,
  name,
  phone,
  onCall,
}: Props) {
  const initials = name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
          <FiUser size={18} className="text-violet-500" />
        </div>

        <Rb_Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </Rb_Text>
      </div>

      {/* Contact */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-medium text-violet-600">
            {initials}
          </div>

          <div className="min-w-0">
            <Rb_Text className="truncate text-lg font-medium text-slate-700">
              {name}
            </Rb_Text>

            {phone && (
              <Rb_Text className="mt-1 text-sm font-normal text-slate-500">
                +91 {phone}
              </Rb_Text>
            )}
          </div>
        </div>

        {phone && (
          <button
            onClick={onCall}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white transition hover:bg-violet-600"
          >
            <FiPhone size={18} />
          </button>
        )}
      </div>

      {phone && (
        <button
          onClick={onCall}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-50 py-3 text-sm font-medium text-violet-600 transition hover:bg-violet-100"
        >
          <FiPhone size={16} />
          Call Contact
        </button>
      )}
    </div>
  );
}