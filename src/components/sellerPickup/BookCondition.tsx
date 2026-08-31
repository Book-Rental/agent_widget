import { useState } from "react";
import { Rb_Radio, Rb_Text } from "@rentbook/rentbook-ui-lib";

type BookConditionType =
  | "GOOD"
  | "MINOR_DAMAGE"
  | "MAJOR_DAMAGE"
  | "LOST";

interface BookConditionProps {
  onConditionChange: (
    condition: BookConditionType | null,
    remarks: string
  ) => void;
}

const conditions = [
  {
    label: "Good",
    value: "GOOD",
  },
  {
    label: "Minor Damage",
    value: "MINOR_DAMAGE",
  },
  {
    label: "Major Damage",
    value: "MAJOR_DAMAGE",
  },
  {
    label: "Lost",
    value: "LOST",
  },
] as const;

const MAX_REMARK_LENGTH = 500;

const BookCondition = ({
  onConditionChange,
}: BookConditionProps) => {
  const [selectedCondition, setSelectedCondition] =
    useState<BookConditionType | null>(null);

  const [remarks, setRemarks] = useState("");

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Rb_Text className="text-lg font-semibold">
        Book Condition
      </Rb_Text>

      <Rb_Text className="mt-1 text-sm text-gray-500">
        Select the current condition of the book before pickup.
      </Rb_Text>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <Rb_Text className="mb-3 font-medium">
            Condition
          </Rb_Text>

          <div className="space-y-3">
            {conditions.map((condition) => (
              <div
                key={condition.value}
                className="rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
              >
                <Rb_Radio
                  name="bookCondition"
                  value={condition.value}
                  checked={
                    selectedCondition === condition.value
                  }
                  onChange={() => {
                    setSelectedCondition(condition.value);
                    onConditionChange(condition.value, remarks);
                  }}
                  label={condition.label}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <Rb_Text className="font-medium">
            Remarks
            <span className="ml-1 text-gray-500">
              (Optional)
            </span>
          </Rb_Text>

          <textarea
            value={remarks}
            onChange={(e) => {
              const value = e.target.value;
              setRemarks(value);
              onConditionChange(selectedCondition, value);
            }}
            maxLength={MAX_REMARK_LENGTH}
            rows={9}
            placeholder="Add any observations about the book..."
            className="mt-3 flex-1 resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500"
          />

          <div className="mt-2 text-right text-xs text-gray-500">
            {remarks.length} / {MAX_REMARK_LENGTH}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCondition;