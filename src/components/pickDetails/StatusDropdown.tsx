import { Dropdown } from "@rentbook/rentbook-ui-lib";
import type {
  JourneyType,
  OrderStatus,
} from "../../Types/AgentTypes";
import { STATUS_META } from "../orderDetails/Agentorderstatusdisplay";

type Props = {
  currentStatus: OrderStatus;
  journeyType: JourneyType;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const StatusDropdown = ({
  currentStatus,
  onChange,
  journeyType,
  disabled = false,
}: Props) => {
  const meta = STATUS_META[currentStatus];

  const dropdownProps = {
    value: currentStatus,
    onChange,
    disabled,
    className: disabled
      ? "cursor-not-allowed opacity-60"
      : "cursor-pointer",
  };

  if (
    journeyType === "Pickup" &&
    currentStatus === "Pickup Assigned"
  ) {
    return (
      <Dropdown
        {...dropdownProps}
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
    journeyType === "Delivery" &&
    currentStatus === "Delivery Agent Assigned"
  ) {
    return (
      <Dropdown
        {...dropdownProps}
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
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        meta?.badge ?? ""
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          meta?.dot ?? ""
        }`}
      />
      {meta?.label ?? currentStatus}
    </span>
  );
};

export default StatusDropdown;