import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { FiPackage } from "react-icons/fi";

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
  onStatusChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
          <FiPackage size={20} className="text-violet-500" />
        </div>

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
      </div>

      {/* Right */}
      <div className="w-full md:w-auto">
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