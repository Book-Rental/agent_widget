import { Dropdown } from "@rentbook/rentbook-ui-lib";
import { AgentOrder, OrderStatus } from "../../Types/AgentTypes";

export type StatusMeta = {
  label: string;
  badge: string;
  dot: string;
};

export type StatusDropdownConfig = {
  /** the order status that should render as an editable dropdown */
  triggerStatus: OrderStatus;
  options: { label: string; value: OrderStatus }[];
};

type OrderStatusControlProps = {
  order: AgentOrder;
  statusMeta: Partial<Record<OrderStatus, StatusMeta>>;
  dropdownConfigs?: StatusDropdownConfig[];
  onStatusChange: (order: AgentOrder, status: OrderStatus) => void;
};

export const OrderStatusControl = ({
  order,
  statusMeta,
  dropdownConfigs = [],
  onStatusChange,
}: OrderStatusControlProps) => {
  const dropdownConfig = dropdownConfigs.find(
    (config) => config.triggerStatus === order.orderStatus
  );

  if (dropdownConfig) {
    return (
      <div className="shrink-0">
        <Dropdown
          options={dropdownConfig.options}
          value={order.orderStatus}
          onChange={(value) => onStatusChange(order, value as OrderStatus)}
        />
      </div>
    );
  }

  const meta = statusMeta[order.orderStatus];
  if (!meta) {
    return (
      <span className="inline-flex shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
        {order.orderStatus}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
};