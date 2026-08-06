import { Rb_Button, Rb_Text } from "@rentbook/rentbook-ui-lib";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import type { OrderStatus } from "../../Types/AgentTypes";

type Props = {
  status: OrderStatus;
  onVerify: () => void;
  onSorting: () => void;
  onDelivered: () => void;
};

const ActionCard = ({ status, onVerify, onDelivered }: Props) => {
  if (status === "Out For Pickup") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-violet-50 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <FiCheckCircle size={16} />
          </div>
          <Rb_Text className="text-sm font-medium text-violet-900">
            Ready for pickup verification
          </Rb_Text>
        </div>

        <Rb_Button
          onClick={onVerify}
          className="flex shrink-0 items-center gap-1.5"
        >
          Proceed
          <FiArrowRight size={14} />
        </Rb_Button>
      </div>
    );
  }

  if (status === "Out For Delivery") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <FiCheckCircle size={16} />
          </div>
          <Rb_Text className="text-sm font-medium text-emerald-900">
            Complete delivery
          </Rb_Text>
        </div>

        <Rb_Button onClick={onDelivered} className="shrink-0">
          Mark Delivered
        </Rb_Button>
      </div>
    );
  }

  return null;
};

export default ActionCard;