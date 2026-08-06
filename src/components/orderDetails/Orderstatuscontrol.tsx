import { Dropdown } from "@rentbook/rentbook-ui-lib";
import type { AgentOrder, OrderStatus } from "../../Types/AgentTypes";

export type StatusMeta = {
  label: string;
  badge: string;
  dot: string;
};

export type StatusDropdownConfig = {
  triggerStatus: OrderStatus;
  options: {
    label: string;
    value: OrderStatus;
  }[];
};

type Props = {
  order: AgentOrder;
  statusMeta: Partial<Record<OrderStatus, StatusMeta>>;
  dropdownConfigs?: StatusDropdownConfig[];
  onStatusChange: (
    order: AgentOrder,
    status: OrderStatus
  ) => void;
};


export const OrderStatusControl = ({
  order,
  statusMeta,
  dropdownConfigs = [],
  onStatusChange,
}: Props) => {

  const dropdownConfig = dropdownConfigs.find(
    (item) => item.triggerStatus === order.orderStatus
  );


  if (dropdownConfig) {
    return (
      <div className="min-w-[150px]">
       
          <Dropdown
            options={dropdownConfig.options}
            value={order.orderStatus}
            onChange={(value) =>
              onStatusChange(order, value as OrderStatus)
            }
          />
      </div>
    );
  }


  const meta = statusMeta[order.orderStatus];


  if (!meta) {
    return (
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
        {order.orderStatus}
      </span>
    );
  }


  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${meta.badge}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
      />
      {meta.label}
    </span>
  );
};