"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// Reusable Modal Content wrapper for consistent padding
export function ModalContent({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>;
}

// Reusable Modal Footer for action buttons
export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className="p-4 border-t bg-gray-50 flex gap-3">{children}</div>;
}

// Reusable Modal Buttons
interface ModalButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}

export function ModalButton({
  onClick,
  children,
  variant = "primary",
  disabled = false,
  type = "button",
}: ModalButtonProps) {
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
