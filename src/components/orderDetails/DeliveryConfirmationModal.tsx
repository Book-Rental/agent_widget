import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Rb_Button,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

type Props = {
  isOpen: boolean;
  action: "accept" | "reject";
  selectedCount: number;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeliveryConfirmationModal({
  isOpen,
  action,
  selectedCount,
  onClose,
  onConfirm,
}: Props) {
  const isAccept = action === "accept";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>
        <Rb_Text className="text-lg font-semibold">
          {isAccept ? "Accept Deliveries" : "Reject Deliveries"}
        </Rb_Text>
      </ModalHeader>

      <ModalBody>
        <Rb_Text className="text-sm text-gray-600">
          {isAccept
            ? `Are you sure you want to accept ${selectedCount} selected delivery order${
                selectedCount > 1 ? "s" : ""
              }?`
            : `Are you sure you want to reject ${selectedCount} selected delivery order${
                selectedCount > 1 ? "s" : ""
              }?`}
        </Rb_Text>
      </ModalBody>

      <ModalFooter className="flex justify-end gap-3">
        <Rb_Button variant="secondary" onClick={onClose}>
          Cancel
        </Rb_Button>

        <Rb_Button variant="primary" onClick={onConfirm}>
          {isAccept ? "Accept" : "Reject"}
        </Rb_Button>
      </ModalFooter>
    </Modal>
  );
}