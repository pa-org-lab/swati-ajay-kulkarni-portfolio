"use client";

import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiLoader,
  FiTrash2,
  FiX,
} from "react-icons/fi";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  icon,
}: ConfirmationModalProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setInternalLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const busy = isLoading || internalLoading;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
    } catch (error) {
      console.error("Confirmation action error:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  const renderIcon = () => {
    if (icon) return icon;
    if (variant === "danger") {
      return <FiTrash2 className="text-[22px]" />;
    }
    if (variant === "warning") {
      return <FiAlertTriangle className="text-[22px]" />;
    }
    return <FiAlertCircle className="text-[22px]" />;
  };

  const getIconBadgeStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-rose-50 text-red-600 border border-rose-200/80 shadow-[0_4px_16px_rgba(225,29,72,0.12)]";
      case "warning":
        return "bg-amber-50 text-amber-600 border border-amber-200/80 shadow-[0_4px_16px_rgba(217,119,6,0.12)]";
      default:
        return "bg-[#f8f3f0] text-[#a8522e] border border-[#e8ded7] shadow-[0_4px_16px_rgba(168,82,46,0.12)]";
    }
  };

  const getConfirmButtonStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white shadow-[0_3px_12px_rgba(220,38,38,0.28)] hover:shadow-[0_5px_16px_rgba(220,38,38,0.36)]";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white shadow-[0_3px_12px_rgba(217,119,6,0.28)] hover:shadow-[0_5px_16px_rgba(217,119,6,0.36)]";
      default:
        return "bg-[#a8522e] hover:bg-[#8e4325] text-white shadow-[0_3px_12px_rgba(168,82,46,0.28)] hover:shadow-[0_5px_16px_rgba(168,82,46,0.36)]";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[3px] animate-in fade-in duration-200"
      onClick={() => !busy && onClose()}
      onKeyDown={(e) => e.key === "Escape" && !busy && onClose()}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(43,31,24,0.18)] border border-[#e8e2dc] p-6 sm:p-7 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#a89488] hover:text-[#2b1f18] hover:bg-[#f4efe9] transition-colors cursor-pointer disabled:opacity-50"
        >
          <FiX className="text-lg" />
        </button>

        {/* Centered Modal Header */}
        <div className="flex flex-col items-center text-center">
          {/* Icon Badge */}
          <div
            className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-transform ${getIconBadgeStyles()}`}
          >
            {renderIcon()}
          </div>

          {/* Title */}
          <h3
            id="confirm-modal-title"
            className="text-[20px] font-bold text-[#2b1f18] tracking-tight mt-4"
          >
            {title}
          </h3>

          {/* Message */}
          <div className="mt-2 text-[13.5px] text-[#6b5a50] leading-relaxed max-w-[330px]">
            {typeof message === "string" ? <p>{message}</p> : message}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="w-full py-2.5 px-4 rounded-xl border border-[#d8cec5] bg-white text-[#5c4a3f] font-medium text-[13.5px] hover:bg-[#f7f3f0] hover:text-[#2b1f18] hover:border-[#c9bcb1] transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-[13.5px] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 ${getConfirmButtonStyles()}`}
          >
            {busy ? (
              <>
                <FiLoader className="animate-spin text-sm" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
