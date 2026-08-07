import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { FiMapPin, FiNavigation } from "react-icons/fi";

type Props = {
  title: string;
  subtitle: string;
  name: string;
  address: string;
  city?: string;
  zipCode?: string;
  onMap: () => void;
};

export function LocationCard({
  title,
  subtitle,
  name,
  address,
  city,
  zipCode,
  onMap,
}: Props) {
return (
  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex-1">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Rb_Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </Rb_Text>

          <Rb_Text className="mt-1 text-sm text-slate-500">
            {subtitle}
          </Rb_Text>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
          <FiMapPin size={18} className="text-violet-500" />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Rb_Text className="text-lg font-medium text-slate-700">
          {name}
        </Rb_Text>

        <Rb_Text className="text-sm leading-6 text-slate-500">
          {address}
        </Rb_Text>

        {(city || zipCode) && (
          <Rb_Text className="text-sm text-slate-500">
            {city}
            {zipCode && ` • ${zipCode}`}
          </Rb_Text>
        )}
      </div>
    </div>

    <button
      onClick={onMap}
      className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-50 text-sm font-medium text-violet-600 hover:bg-violet-100"
    >
      <FiNavigation size={16} />
      Open in Maps
    </button>
  </div>
);
}