"use client";

import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

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
