import { FiInfo } from "react-icons/fi";
import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import type { OrderStatus } from "../../Types/AgentTypes";

type StatusNoteCardProps = {
  status: OrderStatus;
};

const STATUS_NOTES: Partial<Record<OrderStatus, string>> = {
  "Pickup Assigned":
    "Please change the status to Out For Pickup when you start the pickup.",

  "Out For Pickup":
    "After collecting the package, validate the book condition and complete the pickup.",

  "Pickup Completed":
    "Please submit the package to the origin hub and complete the handover.",

  "Arrived At Origin Hub":
    "Complete the hub handover process.",

  "Delivery Agent Assigned":
    "Start the delivery process.",

  "Out For Delivery":
    "Complete the delivery.",

  Delivered:
    "Delivery completed successfully.",
};

const StatusNoteCard = ({ status }: StatusNoteCardProps) => {
  const note = STATUS_NOTES[status];

  if (!note) return null;

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
        <FiInfo className="text-blue-600" />
      </div>

      <div className="flex-1">
        <Rb_Text className="text-sm font-semibold text-gray-900">
          Note
        </Rb_Text>

        <Rb_Text className="mt-2 text-sm leading-6 text-gray-700">
          {note}
        </Rb_Text>
      </div>
    </div>
  );
};

export default StatusNoteCard;