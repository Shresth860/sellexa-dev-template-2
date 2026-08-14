"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Swal from "sweetalert2";
import { MapPin, Home, Briefcase, Plus, Trash2, Check } from "lucide-react";

type AddressBookProps = {
  triggerToast: (msg: string) => void;
};

export function AddressBook({ triggerToast }: AddressBookProps) {
  const { user, addAddress, deleteAddress, setDefaultAddress } = useAuth();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [pincode, setPincode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [addressType, setAddressType] = useState<"Home" | "Work">("Home");
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const validateAddress = () => {
    const errs: Record<string, string> = {};

    if (!pincode.trim()) {
      errs.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode.trim())) {
      errs.pincode = "Pincode must be 6 digits";
    }

    if (!houseNumber.trim()) {
      errs.houseNumber = "House/Flat number is required";
    }

    if (!street.trim()) {
      errs.street = "Street address is required";
    }

    if (!city.trim()) {
      errs.city = "City is required";
    }

    if (!stateName.trim()) {
      errs.stateName = "State is required";
    }

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress()) return;

    const rawDisplayName = user?.name || "User";

    addAddress({
      name: rawDisplayName,
      phone: user?.phone || "",
      houseNumber: houseNumber.trim(),
      street: street.trim(),
      city: city.trim(),
      state: stateName.trim(),
      pincode: pincode.trim(),
      type: addressType,
      isDefault: (user?.addresses.length || 0) === 0,
    });

    setPincode("");
    setHouseNumber("");
    setStreet("");
    setCity("");
    setStateName("");
    setAddressType("Home");
    setAddressErrors({});
    setIsAddingAddress(false);

    triggerToast("New address added successfully!");
  };

  const handleDeleteAddress = (id: string) => {
    Swal.fire({
      title: "Delete Address?",
      text: "Are you sure you want to remove this delivery address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-3xl font-sans",
        title: "text-lg font-bold text-zinc-900",
        confirmButton: "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer",
        cancelButton: "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer shadow-2xs",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAddress(id);
        triggerToast("Address deleted successfully!");
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
          Saved Addresses
        </h2>

        {!isAddingAddress && (
          <Button
            type="button"
            onClick={() => setIsAddingAddress(true)}
            className="h-10 px-4 text-xs font-semibold rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add New Address
          </Button>
        )}
      </div>

      {isAddingAddress && (
        <div className="mb-6 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200/60">
            <h3 className="text-sm font-bold text-zinc-900">Add New Delivery Address</h3>
            
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setAddressType("Home")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  addressType === "Home"
                    ? "bg-[#0f172a] text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </button>
              <button
                type="button"
                onClick={() => setAddressType("Work")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  addressType === "Work"
                    ? "bg-[#0f172a] text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Work
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveAddress} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Pincode"
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  error={addressErrors.pincode}
                  placeholder="e.g. 560001"
                />
              </div>
              <div>
                <Input
                  label="House / Flat Number"
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  error={addressErrors.houseNumber}
                  placeholder="e.g. Flat 402, Building 3"
                />
              </div>
            </div>

            <div>
              <Input
                label="Street / Locality"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                error={addressErrors.street}
                placeholder="e.g. Highrise Heights, MG Road"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="City"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  error={addressErrors.city}
                  placeholder="e.g. Bengaluru"
                />
              </div>
              <div>
                <Input
                  label="State"
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  error={addressErrors.stateName}
                  placeholder="e.g. Karnataka"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsAddingAddress(false);
                  setAddressErrors({});
                }}
                className="h-10 px-4 text-xs font-semibold rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 px-6 text-xs font-semibold rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white"
              >
                Save Address
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {(!user?.addresses || user.addresses.length === 0) ? (
          <div className="p-6 text-center border-2 border-dashed border-zinc-200 rounded-2xl">
            <MapPin className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-700">No addresses saved yet</p>
            <p className="text-xs text-zinc-500 mt-1">Add a new delivery address above.</p>
          </div>
        ) : (
          user.addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                addr.isDefault
                  ? "border-zinc-900 bg-zinc-50/70 shadow-sm"
                  : "border-zinc-200/90 bg-white hover:border-zinc-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-xs ${
                      addr.type === "Work"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-[#fff6e8] text-[#b55d18] border border-[#fed7aa]"
                    }`}
                  >
                    {addr.type === "Work" ? (
                      <Briefcase className="w-3 h-3" />
                    ) : (
                      <Home className="w-3 h-3" />
                    )}
                    {addr.type || "Home"}
                  </span>

                  {addr.isDefault && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Default Delivery
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-2 py-1 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm font-semibold text-zinc-900">
                {addr.houseNumber ? `${addr.houseNumber}, ` : ""}{addr.street}
              </p>
              <p className="text-xs text-zinc-600 mt-0.5">
                {addr.city}, {addr.state} - <span className="font-semibold text-zinc-900">{addr.pincode}</span>
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Phone: {addr.phone || user.phone}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
