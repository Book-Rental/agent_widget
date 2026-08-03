import { Rb_Text } from "@rentbook/rentbook-ui-lib";

type ContactCardProps = {
  title: string;
  name: string;
  phone?: string;
  onCall: () => void;
};

const ContactCard = ({
  title,
  name,
  phone,
  onCall,
}: ContactCardProps) => {
  return (
    <div className="mb-4 rounded-2xl border bg-white p-5">
      <div className="flex justify-between">
        <Rb_Text className="font-semibold">
          {title}
        </Rb_Text>

        <button
          type="button"
          onClick={onCall}
          className="text-violet-600"
        >
          Call
        </button>
      </div>

      <Rb_Text className="mt-2">
        {name}
      </Rb_Text>

      {phone && (
        <Rb_Text className="text-sm text-gray-500">
          +91 {phone}
        </Rb_Text>
      )}
    </div>
  );
};

export default ContactCard;