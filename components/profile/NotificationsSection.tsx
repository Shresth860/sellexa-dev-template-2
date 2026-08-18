"use client";

import React, { useState } from "react";
import {
  Bell,
  Package,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Check,
  TrendingDown,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: "Orders" | "Offers" | "System";
  isRead: boolean;
  iconType: "order" | "offer" | "price_drop" | "security" | "delivery";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Order #SLX-98421 Shipped!",
    description:
      "Your order containing UrbanEdge Jeans & Oxford Shirt is on its way. Estimated delivery: Aug 05, 2026.",
    time: "2 hours ago",
    category: "Orders",
    isRead: false,
    iconType: "order",
  },
  {
    id: "notif-2",
    title: "Exclusive 10% OFF Coupon Unlocked",
    description:
      "Use code WELCOME10 at checkout to get 10% instant savings on your next purchase.",
    time: "Yesterday",
    category: "Offers",
    isRead: false,
    iconType: "offer",
  },
  {
    id: "notif-3",
    title: "Price Drop Alert!",
    description:
      "An item in your wishlist (Essentials Men's Long-Sleeve Oxford Shirt) is now available at a special discount.",
    time: "3 days ago",
    category: "Offers",
    isRead: true,
    iconType: "price_drop",
  },
  {
    id: "notif-4",
    title: "Account Security Update",
    description:
      "Your password and login session were verified. If this wasn't you, please secure your account immediately.",
    time: "1 week ago",
    category: "System",
    isRead: true,
    iconType: "security",
  },
  {
    id: "notif-5",
    title: "Order #SLX-97810 Delivered",
    description:
      "Your package containing AirPulse Pro Wireless Earbuds was delivered safely. We hope you love it!",
    time: "2 weeks ago",
    category: "Orders",
    isRead: true,
    iconType: "delivery",
  },
];

type CategoryFilter = "All" | "Orders" | "Offers" | "System";

export function NotificationsSection({
  triggerToast,
}: {
  triggerToast: (msg: string) => void;
}) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    triggerToast("All notifications marked as read");
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    triggerToast("Notification deleted");
  };

  const getIcon = (type: NotificationItem["iconType"]) => {
    switch (type) {
      case "order":
        return (
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 shadow-xs">
            <Package className="w-5 h-5" />
          </div>
        );
      case "offer":
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#fff6e8] text-[#d77d3c] border border-[#fed7aa] flex items-center justify-center shrink-0 shadow-xs">
            <Tag className="w-5 h-5" />
          </div>
        );
      case "price_drop":
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#fde8e1] text-[#d8566f] border border-[#fbd0c6] flex items-center justify-center shrink-0 shadow-xs">
            <TrendingDown className="w-5 h-5" />
          </div>
        );
      case "security":
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#f4e6ff] text-[#5e3a9f] border border-[#e9d5ff] flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
        );
      case "delivery":
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#e6f9f0] text-emerald-700 border border-[#a7f3d0] flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 rounded-2xl bg-zinc-100 text-zinc-600 border border-zinc-200 flex items-center justify-center shrink-0 shadow-xs">
            <Bell className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-gradient-to-r from-white via-white to-[#fffaf4] rounded-[24px] p-5 sm:p-6 border border-zinc-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-950">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#d8566f] text-white shadow-xs">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
            Stay updated on order status, price drops and account activity
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center bg-[#f5f6f3] p-1 rounded-2xl border border-zinc-200/70">
            {(["All", "Orders", "Offers", "System"] as CategoryFilter[]).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#171a18] text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="flex items-center justify-end px-1">
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className={`text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              unreadCount > 0
                ? "text-[#b55d18] hover:text-[#d77d3c]"
                : "text-zinc-400 cursor-not-allowed"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        </div>
      )}

      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-[24px] p-12 border border-zinc-200/90 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 stroke-1.5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-950">
            No notifications in this category
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mt-1 font-medium">
            You are all caught up! Check back later for updates on your orders and special promotions.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleRead(item.id)}
              className={`bg-white rounded-[24px] p-4 sm:p-5 border transition-all cursor-pointer flex items-start justify-between gap-4 group hover:shadow-md ${
                item.isRead
                  ? "border-zinc-200/90 hover:border-zinc-300"
                  : "border-[#fed7aa] bg-[#fffdfa] hover:border-[#fcd34d] shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {getIcon(item.iconType)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm sm:text-base font-bold truncate ${
                        item.isRead ? "text-zinc-900" : "text-zinc-950 font-black"
                      }`}
                    >
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d8566f] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed font-medium">
                    {item.description}
                  </p>
                  <span className="text-[11px] text-zinc-400 font-semibold mt-2 inline-block">
                    {item.time}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleDelete(item.id, e)}
                className="w-8 h-8 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 cursor-pointer shrink-0"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
