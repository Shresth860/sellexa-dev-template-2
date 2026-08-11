"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalView: "login" | "signup" | "otp";
  pendingContact: string;
  openAuthModal: (view?: "login" | "signup") => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: "login" | "signup" | "otp") => void;
  setPendingContact: (contact: string) => void;
  loginWithOtp: (otpCode: string) => Promise<boolean>;
  loginWithSocial: (provider: "google" | "apple") => Promise<void>;
  logout: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: "usr_1",
  name: "Alex Morgan",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
  phone: "9876543210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  addresses: [
    {
      id: "addr_1",
      name: "Alex Morgan",
      phone: "+91 98765 43210",
      street: "Flat 402, Highrise Heights, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      isDefault: true,
    },
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup" | "otp">("login");
  const [pendingContact, setPendingContact] = useState("");


  const openAuthModal = (view: "login" | "signup" = "login") => {
    setAuthModalView(view);
    router.push(`/auth/${view}`);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingContact("");
  };

  const loginWithOtp = async (otpCode: string): Promise<boolean> => {
    if (otpCode.length < 4) return false;

    setUser(DEFAULT_USER);
    closeAuthModal();
    return true;
  };

  const loginWithSocial = async (_provider?: "google" | "apple") => {
    setUser(DEFAULT_USER);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthModalOpen,
        authModalView,
        pendingContact,
        openAuthModal,
        closeAuthModal,
        setAuthModalView,
        setPendingContact,
        loginWithOtp,
        loginWithSocial,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
