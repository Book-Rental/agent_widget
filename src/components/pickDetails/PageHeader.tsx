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
  order,
  onStatusChange,
}: Props) => {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <Rb_Text className="text-xl font-semibold">
          {title}
        </Rb_Text>

        <Rb_Text className="mt-1 text-sm text-gray-500">
          Order ID #{orderNumber}
        </Rb_Text>
      </div>

      <StatusDropdown
        currentStatus={currentStatus}
        deliveryType={deliveryType}
        onChange={onStatusChange}
      />
    </div>
  );
};

export default PageHeader;