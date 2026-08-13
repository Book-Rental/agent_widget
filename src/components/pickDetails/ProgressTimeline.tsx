import { FiCheckCircle } from "react-icons/fi";
import type { OrderStatus } from "../../Types/AgentTypes";

type TimelineItem = {
  label: string;
  date?: string;
  description?: string;
};

type Props = {
  timeline: TimelineItem[];
  currentStatus: OrderStatus;
};

const ProgressTimeline = ({
  timeline,
  currentStatus,
}: Props) => {
  const currentIndex = timeline.findIndex(
    (item) => item.label === currentStatus
  );

  const completedCount =
    currentIndex >= 0 ? currentIndex + 1 : 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Progress
        </h3>

        <span className="text-sm font-semibold text-gray-400">
          {completedCount}/{timeline.length} completed
        </span>
      </div>

      <div>
        {timeline.map((item, index) => {
          const isCompleted =
            index <= currentIndex;

          const isLast =
            index === timeline.length - 1;

          return (
            <div
              key={item.label}
              className="relative flex gap-4"
            >
              {!isLast && (
                <div
                  className={`absolute left-[11px] top-6 h-full w-0.5 ${
                    index < currentIndex
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  }`}
                />
              )}

              <div className="relative z-0 shrink-0">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-300"
                  }`}
                >
                  {isCompleted && (
                    <FiCheckCircle size={16} />
                  )}
                </div>
              </div>

              <div
                className={`pb-8 ${
                  isLast ? "pb-0" : ""
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">
                  {item.label}
                </p>

                {item.date && (
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(
                      item.date
                    ).toLocaleString()}
                  </p>
                )}

                {item.description && (
                  <p className="mt-2 text-sm font-medium text-sky-600">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTimeline;