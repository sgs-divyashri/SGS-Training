import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} 
    >
      <div
        className="bg-white rounded-lg p-5 w-100 shadow-lg"
        onClick={e => e.stopPropagation()} 
      >
        {children}
      </div>
    </div>
  );
};