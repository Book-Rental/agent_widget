// Shared primitive — put in components/pickDetails/Card.tsx
// Every card on this page should render through this so radius,
// border, shadow and padding stay identical everywhere.
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

export default Card;