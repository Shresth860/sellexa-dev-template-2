"use client";

import Link from "next/link";
import {
  User,
  MapPin,
  Tag,
  Heart,
  Bell,
  ChevronRight,
  LogOut,
} from "lucide-react";
import type { UserProfile } from "@/context/AuthContext";

export type ProfileTab =
  | "personal"
  | "addresses"
  | "coupons"
  | "wishlist"
  | "notifications";

type ProfileSidebarProps = {
  user: UserProfile;
  displayName: string;
  initials: string;
  activeTab: ProfileTab;
  onLogout: () => void;
};

const navItems = [
  {
    key: "personal" as ProfileTab,
    label: "Personal Details",
    href: "/profile/info",
    icon: User,
    color: "text-blue-600 bg-blue-50 border border-blue-100",
  },
  {
    key: "addresses" as ProfileTab,
    label: "Saved Addresses",
    href: "/profile/address",
    icon: MapPin,
    color: "text-amber-600 bg-amber-50 border border-amber-100",
  },
  {
    key: "coupons" as ProfileTab,
    label: "Coupons & Vouchers",
    href: "/profile/coupons",
    icon: Tag,
    color: "text-[#d77d3c] bg-[#fff6e8] border border-[#fed7aa]",
  },
  {
    key: "wishlist" as ProfileTab,
    label: "My Wishlist",
    href: "/profile/wishlist",
    icon: Heart,
    color: "text-[#d8566f] bg-[#fde8e1] border border-[#fbd0c6]",
  },
  {
    key: "notifications" as ProfileTab,
    label: "Notifications",
    href: "/profile/notifications",
    icon: Bell,
    color: "text-purple-600 bg-[#f4e6ff] border border-purple-100",
  },
];

export function ProfileSidebar({
  user,
  displayName,
  initials,
  activeTab,
  onLogout,
}: ProfileSidebarProps) {
  return (
    <div className="lg:col-span-3 flex flex-col gap-3">
      <div className="bg-white rounded-[24px] p-5 border border-zinc-200/90 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#171a18] via-zinc-900 to-zinc-800 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-md ring-4 ring-[#fff6e8]">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-zinc-950 truncate">
            {displayName}
          </h2>
          <p className="text-xs text-zinc-500 truncate mt-0.5 font-medium">
            {user.email}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-3 border border-zinc-200/90 shadow-sm flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#171a18] text-white shadow-md"
                  : "text-zinc-700 hover:bg-[#f5f6f3] hover:text-zinc-950"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isActive ? "bg-white/15 text-white" : item.color
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>

              <ChevronRight
                className={`w-4 h-4 ${
                  isActive ? "text-zinc-400" : "text-zinc-300"
                }`}
              />
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer mt-1 border-t border-zinc-100 pt-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Log Out</span>
          </div>
        </button>
      </div>
    </div>
  );
}
