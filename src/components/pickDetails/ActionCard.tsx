import {
  Rb_Button,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

import { FiArrowRight } from "react-icons/fi";
import type { OrderStatus } from "../../Types/AgentTypes";

type Props = {
  status: OrderStatus;
  onVerify: () => void;
  onSorting: () => void;
  onDelivered: () => void;
};

const ActionCard = ({
  status,
  onVerify,
  onSorting,
  onDelivered,
}: Props) => {
  if (status === "Out For Pickup") {
    return (
      <div className="mt-4 rounded-2xl bg-violet-50 p-4 flex justify-between">
        <Rb_Text>
          Ready for pickup verification
        </Rb_Text>

        <Rb_Button onClick={onVerify}>
          Proceed
          <FiArrowRight />
        </Rb_Button>
      </div>
    );
  }

  if (status === "Pickup Completed") {
    return (
      <div className="mt-4 rounded-2xl bg-indigo-50 p-4 flex justify-between">
        <Rb_Text>
          Submit book to hub
        </Rb_Text>

        <Rb_Button onClick={onSorting}>
          Complete Sorting
        </Rb_Button>
      </div>
    );
  }

  if (status === "Out For Delivery") {
    return (
      <div className="mt-4 rounded-2xl bg-emerald-50 p-4 flex justify-between">
        <Rb_Text>
          Complete delivery
        </Rb_Text>

        <Rb_Button onClick={onDelivered}>
          Mark Delivered
        </Rb_Button>
      </div>
    );
  }

  return null;
};

export default ActionCard;