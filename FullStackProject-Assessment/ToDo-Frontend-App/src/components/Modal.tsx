import React, { useEffect, useRef } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} // closes when clicking outside
    >
      <div
        className="bg-white rounded-lg p-5 w-80 shadow-lg"
        onClick={e => e.stopPropagation()} // prevents closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
};