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
      <div className="grid grid-cols-2 gap-6 border-b border-gray-200 pb-5">
        <div>
          <Rb_Text className="text-sm text-gray-500">
            Order ID
          </Rb_Text>

          <Rb_Text className="mt-1 text-lg font-semibold text-gray-900">
            {orderId}
          </Rb_Text>
        </div>
      </div>

      {/* Book Details */}
      <div className="mt-6 flex items-start gap-4">
        <Rb_Image
          src={book.coverImage}
          alt={book.name}
          className="h-32 w-24 flex-shrink-0 rounded-lg border object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="space-y-3">
            <div className="flex">
              <Rb_Text className="w-20 flex-shrink-0 text-sm font-medium text-gray-700 sm:w-28">
                Book
              </Rb_Text>

              <Rb_Text className="min-w-0 break-words text-sm text-gray-900">
                {book.name}
              </Rb_Text>
            </div>

            <div className="flex">
              <Rb_Text className="w-20 flex-shrink-0 text-sm font-medium text-gray-700 sm:w-28">
                Author
              </Rb_Text>

              <Rb_Text className="min-w-0 break-words text-sm text-gray-900">
                {book.author}
              </Rb_Text>
            </div>

            <div className="flex">
              <Rb_Text className="w-20 flex-shrink-0 text-sm font-medium text-gray-700 sm:w-28">
                Language
              </Rb_Text>

              <Rb_Text className="min-w-0 break-words text-sm text-gray-900">
                {book.language}
              </Rb_Text>
            </div>

            <div className="flex">
              <Rb_Text className="w-20 flex-shrink-0 text-sm font-medium text-gray-700 sm:w-28">
                Edition
              </Rb_Text>

              <Rb_Text className="min-w-0 break-words text-sm text-gray-900">
                {book.edition}
              </Rb_Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupBookInfo;