import { FaCheck } from "react-icons/fa";
import { Rb_Button, Rb_Text } from "@rentbook/rentbook-ui-lib";

interface PickupSuccessProps {
  orderId: string;
  bookName: string;
  pickedUpFrom: string;
  dateTime: string;
  onViewOrderDetails: () => void;
  onBackToOrders: () => void;
}

const PickupSuccess = ({
  orderId,
  bookName,
  pickedUpFrom,
  dateTime,
  onViewOrderDetails,
  onBackToOrders,
}: PickupSuccessProps) => {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-lg">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500">
          <FaCheck className="text-5xl text-white" />
        </div>
      </div>

      {/* Heading */}
      <Rb_Text className="mt-6 text-center text-3xl font-bold text-gray-900">
        Pickup Confirmed!
      </Rb_Text>

      <Rb_Text className="mt-2 text-center text-gray-500">
        You have successfully picked up the book.
      </Rb_Text>

      {/* Details */}
      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
        <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-4">
          <Rb_Text className="text-gray-500">Order ID</Rb_Text>
          <Rb_Text className="text-right text-gray-900">
            {orderId}
          </Rb_Text>
        </div>

        <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-4">
          <Rb_Text className="text-gray-500">Book</Rb_Text>
          <Rb_Text className="text-right text-gray-900">
            {bookName}
          </Rb_Text>
        </div>

        <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-4">
          <Rb_Text className="text-gray-500">
            Picked Up From
          </Rb_Text>
          <Rb_Text className="text-right text-gray-900">
            {pickedUpFrom}
          </Rb_Text>
        </div>

        <div className="grid grid-cols-2 px-5 py-4">
          <Rb_Text className="text-gray-500">
            Date & Time
          </Rb_Text>
          <Rb_Text className="text-right text-gray-900">
            {dateTime}
          </Rb_Text>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8">
        <div className="mt-8 flex justify-center">
            <Rb_Button
                variant="primary"
                className="min-w-[220px]"
                onClick={onViewOrderDetails}
            >
                View Order Details
            </Rb_Button>
        </div>

        <button
          onClick={onBackToOrders}
          className="mt-5 w-full text-center font-medium text-blue-600 hover:underline"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default PickupSuccess;