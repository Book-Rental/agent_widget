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
  title: string;
  message: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel,
  onClose,
  onConfirm,
}: Props) {
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>
        <Rb_Text className="text-lg font-semibold">
           {title}
        </Rb_Text>
      </ModalHeader>

      <ModalBody>
        <Rb_Text className="text-sm text-gray-600">
          {message}
        </Rb_Text>
      </ModalBody>

      <ModalFooter className="flex justify-end gap-3">
        <Rb_Button variant="secondary" onClick={onClose}>
          Cancel
        </Rb_Button>

        <Rb_Button variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </Rb_Button>
      </ModalFooter>
    </Modal>
  );
}