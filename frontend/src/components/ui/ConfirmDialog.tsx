import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'warning';
  variant?: 'primary' | 'danger' | 'warning'; // Alias for confirmVariant
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '確認',
  message,
  children,
  confirmText = '確認',
  cancelText = '取消',
  confirmVariant = 'danger',
  variant,
  loading = false
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Confirm action failed:', error);
    }
  };
  
  const actualVariant = variant || confirmVariant;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
    >
      <div className="mb-6">
        {children ? children : <p className="text-sm text-gray-500">{message}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={actualVariant}
          onClick={handleConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;