"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

export interface Address {
  id: string;
  name: string;
  phone: string;
  houseNumber?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type?: "Home" | "Work";
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
  walletBalance?: number;
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
  updateProfile: (updated: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  logout: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: "usr_1",
  name: "Aarav Sharma",
  firstName: "Aarav",
  lastName: "Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  walletBalance: 1250.0,
  addresses: [
    {
      id: "addr_1",
      name: "Aarav Sharma",
      phone: "+91 98765 43210",
      houseNumber: "Flat 402",
      street: "Highrise Heights, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      type: "Home",
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

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedFirstName = updated.firstName ?? prev.firstName ?? "";
      const updatedLastName = updated.lastName ?? prev.lastName ?? "";
      const fullName = `${updatedFirstName} ${updatedLastName}`.trim() || prev.name;
      return {
        ...prev,
        ...updated,
        name: fullName,
      };
    });
  };

  const addAddress = (newAddrData: Omit<Address, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const newId = `addr_${Date.now()}`;
      const isFirst = prev.addresses.length === 0;
      const newAddress: Address = {
        ...newAddrData,
        id: newId,
        isDefault: newAddrData.isDefault || isFirst,
      };
      
      let updatedAddresses = prev.addresses;
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
      }

      return {
        ...prev,
        addresses: [...updatedAddresses, newAddress],
      };
    });
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const filtered = prev.addresses.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return { ...prev, addresses: filtered };
    });
  };

  const setDefaultAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        })),
      };
    });
  };

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
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
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
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
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
