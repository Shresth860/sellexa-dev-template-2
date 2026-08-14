"use client";

import React from "react";
import { CouponsSection } from "@/components/profile/CouponsSection";

export default function ProfileCouponsPage({
  triggerToast,
}: {
  triggerToast?: (msg: string) => void;
}) {
  return <CouponsSection triggerToast={triggerToast || (() => {})} />;
}
