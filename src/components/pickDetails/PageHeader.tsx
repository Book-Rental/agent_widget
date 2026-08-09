import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import StatusDropdown from "./StatusDropdown";

import type {
  OrderStatus,
  DeliveryType,
} from "../../Types/AgentTypes";

type Props = {
  title: string;
  orderNumber: string;
  currentStatus: OrderStatus;
  deliveryType: DeliveryType;
  onStatusChange: (value: string) => void;
  disabled?: boolean;
};

const PageHeader = ({
  title,
  orderNumber,
  currentStatus,
  deliveryType,
  onStatusChange,
  disabled = false,
}: Props) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center">
      <div>
        <Rb_Text className="text-lg font-medium text-slate-700">
          {title}
        </Rb_Text>

        <Rb_Text className="mt-1 text-sm text-slate-500">
          Order ID{" "}
          <span className="font-medium text-slate-600">
            #{orderNumber}
          </span>
        </Rb_Text>
      </div>

      <div className="w-full md:w-auto">
        <StatusDropdown
          currentStatus={currentStatus}
          deliveryType={deliveryType}
          onChange={onStatusChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default PageHeader;