"use client";

import React from "react";
import { AddressBook } from "@/components/profile/AddressBook";

export default function ProfileAddressPage({
  triggerToast,
}: {
  triggerToast?: (msg: string) => void;
}) {
  return <AddressBook triggerToast={triggerToast || (() => {})} />;
}
