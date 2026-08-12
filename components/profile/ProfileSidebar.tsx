"use client";

import React from "react";
import { User, MapPin, ChevronRight, LogOut } from "lucide-react";
import type { UserProfile } from "@/context/AuthContext";

type ProfileSidebarProps = {
  user: UserProfile;
  displayName: string;
  initials: string;
  activeTab: "personal" | "addresses";
  setActiveTab: (tab: "personal" | "addresses") => void;
  onLogout: () => void;
};

export function ProfileSidebar({
  user,
  displayName,
  initials,
  activeTab,
  setActiveTab,
  onLogout,
}: ProfileSidebarProps) {
  return (
    <div className="lg:col-span-3 flex flex-col gap-2.5">
      <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-zinc-200/90 shadow-sm flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-[#0f172a] text-white flex items-center justify-center text-base sm:text-lg font-bold shrink-0 shadow-xs">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 truncate">
            {displayName}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 truncate mt-0.5">
            {user.email}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-2.5 border border-zinc-200/90 shadow-sm flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("personal")}
          className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === "personal"
              ? "bg-[#0f172a] text-white shadow-md"
              : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
        >
          <div className="flex items-center gap-3">
            <User className={`w-4 h-4 ${activeTab === "personal" ? "text-white" : "text-zinc-500"}`} />
            <span>Personal Details</span>
          </div>
          <ChevronRight className={`w-4 h-4 ${activeTab === "personal" ? "text-zinc-400" : "text-zinc-300"}`} />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("addresses")}
          className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === "addresses"
              ? "bg-[#0f172a] text-white shadow-md"
              : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
        >
          <div className="flex items-center gap-3">
            <MapPin className={`w-4 h-4 ${activeTab === "addresses" ? "text-white" : "text-zinc-500"}`} />
            <span>Saved Addresses</span>
          </div>
          <ChevronRight className={`w-4 h-4 ${activeTab === "addresses" ? "text-zinc-400" : "text-zinc-300"}`} />
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer mt-1 border-t border-zinc-100 pt-2.5"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Log Out</span>
          </div>
        </button>
      </div>
    </div>
  );
}
