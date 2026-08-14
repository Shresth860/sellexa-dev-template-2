"use client";

import React from "react";
import { WishlistSection } from "@/components/profile/WishlistSection";

export default function ProfileWishlistPage({
  triggerToast,
}: {
  triggerToast?: (msg: string) => void;
}) {
  return <WishlistSection triggerToast={triggerToast || (() => {})} />;
}
