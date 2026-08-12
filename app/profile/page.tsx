"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { AddressBook } from "@/components/profile/AddressBook";
import { ArrowLeft, User, CheckCircle2 } from "lucide-react";

const formatTitleCase = (str: string) => {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function ProfilePage() {
  const { user, openAuthModal, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"personal" | "addresses">("personal");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Profile updated successfully!");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 pb-16 font-sans">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
          <div className="w-full px-3 sm:px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-zinc-900 hover:text-zinc-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 transition-colors shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                My Account
              </h1>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-md px-4 pt-16 text-center">
          <div className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 mb-4">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">Account Login Required</h2>
            <p className="text-xs text-zinc-500 mb-6">
              Please log in or sign up to view and manage your account details, saved addresses, and wallet balance.
            </p>
            <Button
              onClick={() => openAuthModal("login")}
              className="w-full h-11 text-xs font-semibold rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-md cursor-pointer"
            >
              Login / Sign Up
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const rawDisplayName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const displayName = formatTitleCase(rawDisplayName);

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 pb-16 font-sans">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
        <div className="w-full px-3 sm:px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-zinc-900 hover:text-zinc-600 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 transition-colors shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              My Account
            </h1>
          </Link>
        </div>
      </header>

      <main className="w-full px-3 sm:px-5 md:px-6 pt-4 sm:pt-5">
        {showToast && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-5 duration-300 border border-zinc-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          <ProfileSidebar
            user={user}
            displayName={displayName}
            initials={initials}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={logout}
          />

          <div className="lg:col-span-9 flex flex-col gap-5">
            {activeTab === "personal" && (
              <PersonalInfoForm triggerToast={triggerToast} />
            )}

            {activeTab === "addresses" && (
              <AddressBook triggerToast={triggerToast} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
