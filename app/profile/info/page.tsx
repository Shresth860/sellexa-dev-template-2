"use client";

import React from "react";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";

export default function ProfileInfoPage({
  triggerToast,
}: {
  triggerToast?: (msg: string) => void;
}) {
  return <PersonalInfoForm triggerToast={triggerToast || (() => {})} />;
}
