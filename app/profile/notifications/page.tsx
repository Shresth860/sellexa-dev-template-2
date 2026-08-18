"use client";

import React from "react";
import { NotificationsSection } from "@/components/profile/NotificationsSection";

export default function ProfileNotificationsPage({
  triggerToast,
}: {
  triggerToast?: (msg: string) => void;
}) {
  return <NotificationsSection triggerToast={triggerToast || (() => {})} />;
}
