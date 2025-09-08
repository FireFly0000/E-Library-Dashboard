// components/Modal.tsx
import React from "react";
import { useEffect, useRef } from "react";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  // Prevent background scroll when modal are open
  const originalOverflow = useRef<string | null>(null);
  useEffect(() => {
    if (isOpen) {
      // Prevent background scroll
      originalOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      // Restore original overflow
      document.body.style.overflow = originalOverflow.current || "";
    }

    return () => {
      document.body.style.overflow = originalOverflow.current || "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-90 flex justify-center items-center overflow-y-auto">
      <div
        className={clsx(
          "bg-card rounded-2xl py-[35px] px-[20px] shadow-xl relative max-h-[95vh] overflow-y-auto",
          className
        )}
      >
        {/* Close button */}
        <button
          className="absolute text-xl top-2 right-4 text-foreground hover:text-destructive cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Title */}
        {title && (
          <h2 className="text-2xl font-semibold text-center text-foreground mb-6 break-words whitespace-normal px-2 my-2">
            {title}
          </h2>
        )}

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
