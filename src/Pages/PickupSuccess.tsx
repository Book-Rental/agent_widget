import { Rb_Button, Rb_Text ,  Rb_LoadingSpinner} from "@rentbook/rentbook-ui-lib";
import { useShipment } from "../hooks/useShipment";

interface PickupSuccessProps {
  // orderId: string;
  // bookName: string;
  // pickedUpFrom: string;
  // dateTime: string;
  shipmentId: string;
  onViewOrderDetails: () => void;
  onBackToOrders: () => void;
}

// Fixed confetti pieces so the burst is deterministic (no re-render flicker).
// Each entry: [angle(deg), distance(px), delay(s), color, size(px), shape]
const CONFETTI = [
  [-70, 90, 0.05, "#22c55e", 8, "rounded-sm"],
  [-40, 110, 0.1, "#f59e0b", 7, "rounded-full"],
  [-15, 100, 0, "#3b82f6", 8, "rounded-sm"],
  [15, 105, 0.08, "#ec4899", 6, "rounded-full"],
  [40, 95, 0.03, "#a855f7", 8, "rounded-sm"],
  [70, 100, 0.12, "#22c55e", 6, "rounded-full"],
  [-110, 90, 0.06, "#f59e0b", 7, "rounded-sm"],
  [-140, 100, 0.14, "#3b82f6", 8, "rounded-full"],
  [-160, 80, 0.02, "#ec4899", 6, "rounded-sm"],
  [110, 90, 0.1, "#a855f7", 7, "rounded-full"],
  [140, 100, 0.04, "#22c55e", 8, "rounded-sm"],
  [160, 85, 0.16, "#f59e0b", 6, "rounded-full"],
] as const;

const PickupSuccess = ({
  shipmentId,
  onViewOrderDetails,
  onBackToOrders,
}: PickupSuccessProps) => {
  const { data, isLoading, isError, } = useShipment(shipmentId);
  const shipment = data?.data;

  if (isLoading) {
    return <Rb_LoadingSpinner />;
  }

  if (isError || !shipment) {
    return <div>Unable to load shipment.</div>;
  }
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-lg">
      {/* Scoped keyframes for effects that plain Tailwind utilities can't express */}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes ringPulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes confettiBurst {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          100% {
            transform: translate(
              calc(-50% + var(--tx)),
              calc(-50% + var(--ty))
            ) rotate(var(--rot));
            opacity: 0;
          }
        }
        .pickup-check-path {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawCheck 0.4s 0.35s ease-out forwards;
        }
        .pickup-circle {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .pickup-ring {
          animation: ringPulse 1.6s ease-out 0.5s infinite;
        }
        .pickup-confetti {
          animation: confettiBurst 0.9s ease-out forwards;
        }
      `}</style>

      {/* Success Icon */}
      {/* Fixed h-24/w-24 box (matching the circle exactly) so left-1/2 & top-1/2
          below line up with the true center — not the padded container's center. */}
      <div className="relative mx-auto my-4 h-24 w-24">
        {/* Pulsing rings behind the circle — inset-0 keeps them exactly circle-sized/centered */}
        <span className="pickup-ring absolute inset-0 rounded-full bg-green-400" />
        <span
          className="pickup-ring absolute inset-0 rounded-full bg-green-400"
          style={{ animationDelay: "0.9s" }}
        />

        {/* Confetti poppers */}
        {CONFETTI.map(([angle, dist, delay, color, size, shape], i) => {
          const rad = (angle * Math.PI) / 180;
          const tx = Math.cos(rad) * dist;
          const ty = Math.sin(rad) * dist;
          return (
            <span
              key={i}
              className={`pickup-confetti absolute left-1/2 top-1/2 ${shape}`}
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                // @ts-expect-error custom properties used by the keyframe
                "--tx": `${tx}px`,
                "--ty": `${ty}px`,
                "--rot": `${angle > 0 ? 360 : -360}deg`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}

        {/* Green circle with checkmark */}
        <div className="pickup-circle absolute inset-0 flex items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-200">
          <svg
            viewBox="0 0 24 24"
            className="h-12 w-12"
            fill="none"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path className="pickup-check-path" d="M4 12.5 L9.5 18 L20 6" />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <Rb_Text className="mt-6 text-center text-3xl font-bold text-gray-900">
        Pickup Confirmed!
      </Rb_Text>

      <Rb_Text className="mt-2 text-center text-gray-500">
        You have successfully picked up the book.
      </Rb_Text>

      {/* Details */}
      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
        <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-4">
          <Rb_Text className="text-gray-500">Shiment ID</Rb_Text>
          <Rb_Text className="text-right text-gray-900">
            {shipment.orderId}
          </Rb_Text>
        </div>

        {/* <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-4">
          <Rb_Text className="text-gray-500">Book</Rb_Text>
          <Rb_Text className="text-right text-gray-900">
            {bookName}
          </Rb_Text>
        </div> */}

        <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-4">
          <Rb_Text className="text-gray-500">
            Picked Up From
          </Rb_Text>
          <Rb_Text className="text-right text-gray-900">
            {`${shipment.sender.addressLine1}, ${shipment.sender.city}`}
          </Rb_Text>
        </div>

        <div className="grid grid-cols-2 px-5 py-4">
          <Rb_Text className="text-gray-500">
            Date & Time
          </Rb_Text>
          <Rb_Text className="text-right text-gray-900">
            {new Date(shipment.updatedAt).toLocaleString()}
          </Rb_Text>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8">
        <div className="mt-8 flex justify-center">
            <Rb_Button
                variant="primary"
                className="min-w-[220px]"
                onClick={onViewOrderDetails}
            >
                View Order Details
            </Rb_Button>
        </div>

        <button
          onClick={onBackToOrders}
          className="mt-5 w-full text-center font-medium text-blue-600 hover:underline"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default PickupSuccess;