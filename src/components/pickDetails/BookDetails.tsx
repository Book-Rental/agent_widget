import {
  Rb_Image,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

import { FiBookOpen } from "react-icons/fi";
import { OrderItem } from "../../Types/AgentTypes";

type Props = {
  item: OrderItem;
};

const BookDetails = ({ item }: Props) => {
  if (!item) return null;

  return (
    <div className="mb-4 rounded-2xl border bg-white p-5">

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
          <FiBookOpen />
        </div>

        <Rb_Text className="font-semibold">
          Order Details
        </Rb_Text>
      </div>

      <div className="flex gap-4">
        <Rb_Image
          src={item.coverImage}
          alt={item.bookName}
          className="h-24 w-16 rounded-lg object-cover"
        />

        <div>
          <Rb_Text className="font-semibold">
            {item.bookName}
          </Rb_Text>

          <Rb_Text className="text-sm text-gray-500">
            {item.author}
          </Rb_Text>

          <Rb_Text className="mt-2 text-xs">
            Quantity : {item.quantity}
          </Rb_Text>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;