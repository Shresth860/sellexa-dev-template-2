"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Wallet, User, Mail, Phone } from "lucide-react";

const formatTitleCase = (str: string) => {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

type PersonalInfoFormProps = {
  triggerToast: (msg: string) => void;
};

export function PersonalInfoForm({ triggerToast }: PersonalInfoFormProps) {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.name.split(" ")[0] || "");
      setLastName(user.lastName || user.name.split(" ").slice(1).join(" ") || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const resetFormValues = () => {
    if (user) {
      setFirstName(user.firstName || user.name.split(" ")[0] || "");
      setLastName(user.lastName || user.name.split(" ").slice(1).join(" ") || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
    setErrors({});
  };

  const validatePersonalInfo = () => {
    const errs: Record<string, string> = {};

    const trimmedFirst = firstName.trim();
    if (!trimmedFirst) {
      errs.firstName = "First name is required";
    } else if (/^\d+$/.test(trimmedFirst)) {
      errs.firstName = "First name cannot be numbers only";
    }

    const trimmedLast = lastName.trim();
    if (trimmedLast && /^\d+$/.test(trimmedLast)) {
      errs.lastName = "Last name cannot be numbers only";
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address";
    }

    const trimmedPhone = phone.trim();
    const cleanPhone = trimmedPhone.replace(/[\s\-\(\)\+]/g, "");
    if (!trimmedPhone) {
      errs.phone = "Phone number is required";
    } else if (!/^\d+$/.test(cleanPhone)) {
      errs.phone = "Phone number must contain numbers only";
    } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      errs.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    resetFormValues();
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!validatePersonalInfo()) return;

    setIsSubmitting(true);

    const formattedFirstName = formatTitleCase(firstName);
    const formattedLastName = formatTitleCase(lastName);

    setFirstName(formattedFirstName);
    setLastName(formattedLastName);

    setTimeout(() => {
      updateProfile({
        firstName: formattedFirstName,
        lastName: formattedLastName,
        email: email.trim(),
        phone: phone.trim(),
      });
      setIsSubmitting(false);
      setIsEditing(false);
      triggerToast("Profile updated successfully!");
    }, 400);
  };

  const walletAmount = user?.walletBalance ?? 1250.0;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm animate-in fade-in duration-200">
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4">
        Personal Information
      </h2>

      <div className="bg-[#eefcf4] border border-[#d1f5e0] rounded-2xl p-4 sm:p-5 flex items-center gap-4 my-5 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-[#00a66c] text-white flex items-center justify-center shadow-sm shrink-0">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#006e47] mb-0.5">
            WALLET BALANCE
          </p>
          <p className="text-2xl font-black text-zinc-900 tracking-tight">
            ₹{walletAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="First Name"
              type="text"
              value={firstName}
              disabled={!isEditing}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              placeholder="Enter first name"
              leftIcon={<User className="w-4 h-4 text-zinc-400" />}
              className={!isEditing ? "bg-zinc-50 text-zinc-600 border-zinc-200 cursor-not-allowed" : ""}
            />
          </div>

          <div>
            <Input
              label="Last Name"
              type="text"
              value={lastName}
              disabled={!isEditing}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              placeholder="Enter last name"
              leftIcon={<User className="w-4 h-4 text-zinc-400" />}
              className={!isEditing ? "bg-zinc-50 text-zinc-600 border-zinc-200 cursor-not-allowed" : ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Email Address"
              type="email"
              value={email}
              disabled={!isEditing}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="Enter your email"
              leftIcon={<Mail className="w-4 h-4 text-zinc-400" />}
              className={!isEditing ? "bg-zinc-50 text-zinc-600 border-zinc-200 cursor-not-allowed" : ""}
            />
          </div>

          <div>
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              disabled={!isEditing}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              placeholder="Enter phone number"
              leftIcon={<Phone className="w-4 h-4 text-zinc-400" />}
              className={!isEditing ? "bg-zinc-50 text-zinc-600 border-zinc-200 cursor-not-allowed" : ""}
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-zinc-100">
          {isEditing && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelClick}
              className="h-10 px-4 text-xs font-semibold rounded-full"
            >
              Cancel
            </Button>
          )}

          {isEditing ? (
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="h-10 px-6 text-xs font-semibold rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-md"
            >
              Save
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleEditClick}
              className="h-10 px-6 text-xs font-semibold rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-md"
            >
              Edit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
