import type { ReactNode } from "react";
import { Rb_Button, Rb_Image, Rb_Text } from "@rentbook/rentbook-ui-lib";
import { AgentOrder } from "../../Types/AgentTypes";
import {
  formatOrderDate,
  getOrderNumber,
} from "../../utils/Agentorderutils";

type AgentOrderCardProps = {
  order: AgentOrder;
  statusSlot: ReactNode;
  locationSlot?: ReactNode;
  onViewDetails: (order: AgentOrder) => void;
  selectionSlot?: ReactNode;
};

export const AgentOrderCard = ({
  order,
  statusSlot,
  locationSlot,
  onViewDetails,
  selectionSlot,
}: AgentOrderCardProps) => {
  const item = order.items?.[0] ?? null;

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-3">
        {selectionSlot && (
          <div className="flex items-center">{selectionSlot}</div>
        )}
        <Rb_Image
          src={item?.coverImage || "/images/book-placeholder.png"}
          alt={item?.bookName || "Book cover"}
          className="h-20 w-16 sm:h-24 sm:w-18 flex-shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <Rb_Text className="text-sm font-semibold text-gray-900 break-words">
                Order #{getOrderNumber(order)}
              </Rb_Text>

              {item?.bookName && (
                <Rb_Text className="mt-1 text-sm font-medium text-gray-800 break-words">
                  {item.bookName}
                </Rb_Text>
              )}

              {item?.author && (
                <Rb_Text className="mt-1 text-xs text-gray-500 break-words">
                  by {item.author}
                </Rb_Text>
              )}

              {order.items && order.items.length > 1 && (
                <Rb_Text className="mt-1 text-xs text-gray-400">
                  +{order.items.length - 1} more item
                  {order.items.length - 1 > 1 ? "s" : ""}
                </Rb_Text>
              )}
            </div>

            <div className="self-start sm:self-auto flex-shrink-0">
              {statusSlot}
            </div>
          </div>

          {locationSlot && (
            <div className="mt-2">
              {locationSlot}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <Rb_Text className="text-xs text-gray-400">
          Assigned {formatOrderDate(order.assignedDate)}
        </Rb_Text>

        <Rb_Button
          variant="primary"
          className="w-full sm:w-auto"
          onClick={() => onViewDetails(order)}
        >
          View Details
        </Rb_Button>
      </div>
    </div>
  );
};