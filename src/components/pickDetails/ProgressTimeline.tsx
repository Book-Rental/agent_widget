import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { formatDate } from "../../utils/formatDate";

export type TimelineItem = {
  label: string;
  date?: string;
  description?: string;
};

type ProgressTimelineProps = {
  timeline: TimelineItem[];
};

const ProgressTimeline = ({ timeline }: ProgressTimelineProps) => {
  const completedCount = timeline.filter((t) => t.date).length;

  return (
    // Now matches StatusNoteCard: rounded-2xl border bg-white shadow-sm p-5
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Rb_Text className="text-sm font-semibold text-gray-900">
          Progress
        </Rb_Text>
        <Rb_Text className="text-xs font-medium text-gray-400">
          {completedCount}/{timeline.length} completed
        </Rb_Text>
      </div>

      {timeline.map((step, index) => {
        const completed = Boolean(step.date);
        const isNext = !completed && index === completedCount;
        const isLast = index === timeline.length - 1;

        return (
          <div key={step.label} className="relative flex gap-4">
            {!isLast && (
              <div
                className={`absolute left-[9px] top-5 h-full w-px transition-colors duration-500 ${
                  completed ? "bg-blue-400" : "bg-gray-200"
                }`}
              />
            )}

            <div
              className={`relative z-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                completed
                  ? "bg-blue-500"
                  : isNext
                    ? "bg-white ring-2 ring-blue-300"
                    : "bg-gray-200"
              }`}
            >
              {completed ? (
                <FiCheckCircle className="h-3.5 w-3.5 text-white" />
              ) : isNext ? (
                <FiCircle className="h-2 w-2 fill-blue-400 text-blue-400" />
              ) : null}
            </div>

            <div className="pb-6">
              <Rb_Text
                className={
                  completed
                    ? "text-sm font-semibold text-gray-900"
                    : isNext
                      ? "text-sm font-semibold text-blue-600"
                      : "text-sm font-semibold text-gray-400"
                }
              >
                {step.label}
              </Rb_Text>

              <Rb_Text className="mt-1 text-xs text-gray-500">
                {step.date ? formatDate(step.date) : isNext ? "Up next" : "Pending"}
              </Rb_Text>

              {step.description && (
                <Rb_Text className="mt-1 text-xs font-medium text-sky-600">
                  {step.description}
                </Rb_Text>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTimeline;