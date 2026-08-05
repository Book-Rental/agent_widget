import { Dropdown } from "@rentbook/rentbook-ui-lib";
import type { OrderStatus } from "../../Types/AgentTypes";
import { STATUS_META } from "../orderDetails/Agentorderstatusdisplay";

type Props = {
  currentStatus: OrderStatus;
  deliveryType: string;
  onChange: (value: string) => void;
};

const StatusDropdown = ({
  currentStatus,
  deliveryType,
  onChange,
}: Props) => {
  const meta = STATUS_META[currentStatus];

  if (
    deliveryType === "SELLER_TO_HUB" &&
    currentStatus === "Pickup Assigned"
  ) {
    return (
      <Dropdown
        value={currentStatus}
        onChange={onChange}
        options={[
          {
            label: "Pickup Assigned",
            value: "Pickup Assigned",
          },
          {
            label: "Out For Pickup",
            value: "Out For Pickup",
          },
        ]}
      />
    );
  }

  if (
    deliveryType === "HUB_TO_USER" &&
    currentStatus === "Delivery Agent Assigned"
  ) {
    return (
      <Dropdown
        value={currentStatus}
        onChange={onChange}
        options={[
          {
            label: "Delivery Agent Assigned",
            value: "Delivery Agent Assigned",
          },
          {
            label: "Out For Delivery",
            value: "Out For Delivery",
          },
        ]}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${meta?.badge}`}
    >
      <span className={`h-2 w-2 rounded-full ${meta?.dot}`} />
      {meta?.label}
    </span>
  );
};

export default StatusDropdown;