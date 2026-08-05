import type { ReactNode } from "react";
import { Rb_Button, Rb_Image, Rb_Text } from "@rentbook/rentbook-ui-lib";
import { AgentOrder } from "../../Types/AgentTypes";
import { formatOrderDate, getOrderNumber } from "../../utils/Agentorderutils";

type AgentOrderCardProps = {
  order: AgentOrder;
  statusSlot: ReactNode;
  locationSlot?: ReactNode;
  onViewDetails: (order: AgentOrder) => void;
};

export const AgentOrderCard = ({
  order,
  statusSlot,
  locationSlot,
  onViewDetails,
}: AgentOrderCardProps) => {
  const item = order.items?.[0] ?? null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex gap-4">
        <Rb_Image
          src={item?.coverImage || "/images/book-placeholder.png"}
          alt={item?.bookName || "Book cover"}
          className="h-20 w-16 shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Rb_Text className="text-sm font-semibold text-gray-900">
                Order #{getOrderNumber(order)}
              </Rb_Text>

              {item?.bookName && (
                <Rb_Text className="mt-1 truncate text-sm text-gray-800">
                  {item.bookName}
                </Rb_Text>
              )}

              {item?.author && (
                <Rb_Text className="truncate text-xs text-gray-500">
                  by {item.author}
                </Rb_Text>
              )}

              {order.items && order.items.length > 1 && (
                <Rb_Text className="mt-0.5 text-xs text-gray-400">
                  +{order.items.length - 1} more item
                  {order.items.length - 1 > 1 ? "s" : ""}
                </Rb_Text>
              )}
            </div>

            {statusSlot}
          </div>

          {locationSlot}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <Rb_Text className="text-xs text-gray-400">
          Assigned {formatOrderDate(order.assignedDate)}
        </Rb_Text>

        <Rb_Button variant="primary" onClick={() => onViewDetails(order)}>
          View details
        </Rb_Button>
      </div>
    </div>
  );
};