import {
  Rb_Image,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";
import {
  FiBookOpen,
  FiHash,
  FiUser,
} from "react-icons/fi";

import { OrderItem } from "../../Types/AgentTypes";

type Props = {
  item: OrderItem;
};

const BookDetails = ({ item }: Props) => {
  if (!item) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">

      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FiBookOpen size={20} />
        </div>

        <Rb_Text className="text-lg font-semibold text-gray-900">
          Book Details
        </Rb_Text>
      </div>

      {/* Body */}
      <div className="flex gap-5">

        {/* Book Cover */}
        <Rb_Image
          src={item.coverImage}
          alt={item.bookName}
          className="h-36 w-24 rounded-xl border object-cover shadow-sm"
        />

        {/* Details */}
        <div className="flex flex-1 flex-col justify-between">

          <div>
            <Rb_Text className="text-xl font-semibold text-gray-900">
              {item.bookName}
            </Rb_Text>

            <div className="mt-2 flex items-center gap-2 text-gray-500">
              <FiUser size={15} />
              <Rb_Text className="text-sm">
                {item.author}
              </Rb_Text>
            </div>
          </div>

          {/* Info Grid */}
          <div className="mt-5 grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-gray-50 p-3">
              <Rb_Text className="text-xs text-gray-500">
                Quantity
              </Rb_Text>

              <div className="mt-1 flex items-center gap-2">
                <FiHash size={14} />
                <Rb_Text className="font-medium">
                  {item.quantity}
                </Rb_Text>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookDetails;