import type { ReactNode } from "react";
import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { AgentOrder } from "../../Types/AgentTypes";

const LocationBlock = ({
  dotColor,
  label,
  children,
}: {
  dotColor: string;
  label: string;
  children: ReactNode;
}) => (
  <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
    <div className="min-w-0">
      <Rb_Text className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </Rb_Text>
      {children}
    </div>
  </div>
);

export const AgentOrderLocation = ({ order }: { order: AgentOrder }) => {
  if (
    order.journeyType === "Pickup" &&
    order.sellerDetails &&
    (order.orderStatus === "Pickup Assigned" ||
      order.orderStatus === "Out For Pickup")
  ) {
    const address = order.sellerDetails.address;
    return (
      <LocationBlock dotColor="bg-emerald-500" label="Pickup location">
        <Rb_Text className="text-sm text-gray-700">
          {address.street}, {address.city}, {address.state}
        </Rb_Text>
        <Rb_Text className="text-xs text-gray-400">{address.zipCode}</Rb_Text>
      </LocationBlock>
    );
  }

  if (
    order.journeyType === "Pickup" &&
    order.hubDetails &&
    (order.orderStatus === "Pickup Completed" ||
      order.orderStatus === "Arrived At Origin Hub")
  ) {
    return (
      <LocationBlock dotColor="bg-blue-500" label="Hub">
        <Rb_Text className="text-sm font-medium text-gray-800">
          {order.hubDetails.name}
        </Rb_Text>
        <Rb_Text className="text-sm text-gray-600">
          {order.hubDetails.address}, {order.hubDetails.city}
        </Rb_Text>
      </LocationBlock>
    );
  }

  if (
    order.journeyType === "Delivery" &&
    order.userDetails &&
    (order.orderStatus === "Delivery Agent Assigned" ||
      order.orderStatus === "Out For Delivery" ||
      order.orderStatus === "Delivered")
  ) {
    const address = order.userDetails.address;
    return (
      <LocationBlock dotColor="bg-emerald-500" label="Delivery location">
        <Rb_Text className="text-sm text-gray-700">
          {address.street}, {address.city}, {address.state}
        </Rb_Text>
        <Rb_Text className="text-xs text-gray-400">{address.zipCode}</Rb_Text>
      </LocationBlock>
    );
  }

  return null;
};