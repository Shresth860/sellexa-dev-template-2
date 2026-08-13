"use client";

import { usePathname } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const pathname = usePathname();

  if (!isAuthModalOpen || pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      maxWidth="md"
      showCloseButton={true}
    >
      <AuthForm onSuccess={closeAuthModal} />
    </Modal>
  );
}
