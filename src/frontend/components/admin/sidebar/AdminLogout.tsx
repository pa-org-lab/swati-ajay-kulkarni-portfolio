"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import { logout } from "@/backend/actions/auth.action";
import ConfirmationModal from "@/frontend/components/common/ConfirmationModal";

interface AdminLogoutProps {
  onLogout?: () => void;
}

export default function AdminLogout({ onLogout }: AdminLogoutProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handlePerformLogout = async () => {
    if (onLogout) {
      onLogout();
      setShowConfirm(false);
      return;
    }

    setIsLoggingOut(true);
    const toastId = toast.loading("Logging out...");

    try {
      const res = await logout();
      if (res.success) {
        toast.success("Logged out successfully", { id: toastId });
        setShowConfirm(false);
        router.replace("/login");
      } else {
        toast.error("Failed to logout", { id: toastId });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout", { id: toastId });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="px-3 pb-7">
        <div className="mb-4 mx-0 h-px bg-[#ede9e5]" />
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#a89488] hover:text-[#6b5a50] hover:bg-[#f6f2f0] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8522e]"
        >
          <FiLogOut className="text-base shrink-0" />
          <span className="text-[13px] font-medium">Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handlePerformLogout}
        isLoading={isLoggingOut}
        title="Log Out"
        message="Are you sure you want to end your current session and log out of the admin dashboard?"
        confirmText="Log Out"
        cancelText="Cancel"
        variant="warning"
        icon={<FiLogOut className="text-2xl" />}
      />
    </>
  );
}
