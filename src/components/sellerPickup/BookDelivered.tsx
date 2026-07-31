import { FiCheckCircle, FiCalendar, FiUser, FiPhone } from "react-icons/fi";
import { Rb_Button, Rb_Text } from "@rentbook/rentbook-ui-lib";

import { PickupDetails } from "../../Types/pickup";
import PickupBookInfo from "./PickupBookInfo";

interface DeliveryInfo {
  deliveredAt: string;
  deliveredBy: {
    name: string;
    phone: string;
  };
  notes: string;
}

interface BookDeliveredProps {
  pickup: PickupDetails;
  delivery: DeliveryInfo;
}

const BookDelivered = ({ pickup, delivery }: BookDeliveredProps) => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-xl bg-white p-6 shadow-sm">

      {/* Success Banner */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <FiCheckCircle
          size={56}
          className="mx-auto mb-3 text-green-600"
        />

        <Rb_Text className="text-2xl font-bold text-green-700">
          Book Delivered Successfully
        </Rb_Text>

        <Rb_Text className="mt-2 text-gray-600">
          The delivery has been completed successfully.
        </Rb_Text>
      </div>

      {/* Book */}
      <div className="rounded-xl border border-gray-200 p-5">
        <Rb_Text className="mb-4 text-lg font-semibold">
          Book Details
        </Rb_Text>

        <PickupBookInfo pickup={pickup} />
      </div>

      {/* Delivery Details */}
      <div className="rounded-xl border border-gray-200 p-5">
        <Rb_Text className="mb-4 text-lg font-semibold">
          Delivery Details
        </Rb_Text>

        <div className="space-y-4">

          <div className="flex items-center gap-3">
            <FiCalendar className="text-blue-600" size={18} />

            <div>
              <Rb_Text className="text-xs text-gray-500">
                Delivered At
              </Rb_Text>

              <Rb_Text>
                {delivery.deliveredAt}
              </Rb_Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiUser className="text-blue-600" size={18} />

            <div>
              <Rb_Text className="text-xs text-gray-500">
                Delivered By
              </Rb_Text>

              <Rb_Text>
                {delivery.deliveredBy.name}
              </Rb_Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiPhone className="text-blue-600" size={18} />

            <div>
              <Rb_Text className="text-xs text-gray-500">
                Contact
              </Rb_Text>

              <Rb_Text>
                {delivery.deliveredBy.phone}
              </Rb_Text>
            </div>
          </div>

        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-gray-200 p-5">
        <Rb_Text className="mb-2 text-lg font-semibold">
          Notes
        </Rb_Text>

        <Rb_Text className="text-gray-600">
          {delivery.notes}
        </Rb_Text>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Rb_Button>
          Done
        </Rb_Button>
      </div>

    </div>
  );
};

export default BookDelivered;