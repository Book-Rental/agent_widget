import { Rb_Text } from "@rentbook/rentbook-ui-lib";

import type { AgentOrder, OrderStatus } from "../../Types/AgentTypes";
import StatusDropdown from "./StatusDropdown";

type Props = {
  title: string;
   order: AgentOrder;
  orderNumber: string;
  currentStatus: OrderStatus;
  deliveryType: string;
  onStatusChange: (value: string) => void;
};

const PageHeader = ({
  title,
  orderNumber,
  currentStatus,
  deliveryType,
  // order,
  onStatusChange,
}: Props) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
<div className="space-y-1">
  <Rb_Text className="text-xl font-semibold text-slate-800 md:text-2xl">
    {title}
  </Rb_Text>

  <Rb_Text className="break-all text-base font-semibold text-slate-600 md:text-lg">
    Order ID #{orderNumber}
  </Rb_Text>
</div>
    <div className="self-start md:self-auto">
      <StatusDropdown
        currentStatus={currentStatus}
        deliveryType={deliveryType}
        onChange={onStatusChange}
      />
    </div>
  </div>
    );
  };

export default PageHeader;