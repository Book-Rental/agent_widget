import { Rb_Image, Rb_Text } from "@rentbook/rentbook-ui-lib";
import { FiHash, FiMapPin, FiUser } from "react-icons/fi";

import { OrderItem } from "../../Types/AgentTypes";

type Props = {
  item: OrderItem;
  labelMessage?: string;
};

const BookDetails = ({ item, labelMessage }: Props) => {
  if (!item) return null;

  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4">
      <Rb_Image
        src={item.coverImage}
        alt={item.bookName}
        className="h-24 w-16 shrink-0 rounded-lg border border-slate-100 object-cover shadow-sm"
      />

      <div className="min-w-0 flex-1">
        <Rb_Text className="truncate text-lg font-medium text-slate-700">
          {item.bookName}
        </Rb_Text>

        <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2">
          {/* Author */}
          <div className="flex items-center gap-2">
            <FiUser
              size={16}
              className="shrink-0 text-violet-500"
            />

            <div className="flex items-center gap-1.5">
              <Rb_Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Author
              </Rb_Text>

              <Rb_Text className="text-sm text-slate-500">
                {item.author}
              </Rb_Text>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <FiHash
              size={16}
              className="shrink-0 text-violet-500"
            />

            <div className="flex items-center gap-1.5">
              <Rb_Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Quantity
              </Rb_Text>

              <Rb_Text className="text-sm text-slate-500">
                {item.quantity}
              </Rb_Text>
            </div>
          </div>
        </div>

         {labelMessage && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-600 ring-1 ring-slate-100">
            <FiMapPin className="h-4 w-4 text-slate-500" />
            <span>{labelMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;