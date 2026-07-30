import { Rb_Image, Rb_Text } from "@rentbook/rentbook-ui-lib";
import type { PickupDetails } from "../../Types/pickup";

interface PickupBookInfoProps {
  pickup: PickupDetails;
}

const PickupBookInfo = ({ pickup }: PickupBookInfoProps) => {
  const { orderId, book } = pickup;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <Rb_Text className="text-sm text-gray-500">
          Order ID
        </Rb_Text>

        <Rb_Text className="mt-1 text-lg font-semibold text-gray-900">
          {orderId}
        </Rb_Text>
      </div>

      {/* Book Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
        {/* Image */}
        <div className="flex justify-center md:justify-start">
          <Rb_Image
            src={book.coverImage}
            alt={book.name}
            className="h-32 w-24 rounded-lg border object-cover"
          />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex">
            <Rb_Text className="w-24 font-medium text-sm text-gray-700">
              Book
            </Rb_Text>

            <Rb_Text className="text-sm text-gray-900">
              {book.name}
            </Rb_Text>
          </div>

          <div className="flex">
            <Rb_Text className="w-24 font-medium text-sm text-gray-700">
              Author
            </Rb_Text>

            <Rb_Text className="text-sm text-gray-900">
              {book.author}
            </Rb_Text>
          </div>

          <div className="flex">
            <Rb_Text className="w-24 font-medium text-sm text-gray-700">
              Language
            </Rb_Text>

            <Rb_Text className="text-sm text-gray-900">
              {book.language}
            </Rb_Text>
          </div>

          <div className="flex">
            <Rb_Text className="w-24 font-medium text-sm text-gray-700">
              Edition
            </Rb_Text>

            <Rb_Text className="text-sm text-gray-900">
              {book.edition}
            </Rb_Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupBookInfo;