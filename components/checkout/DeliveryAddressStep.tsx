"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Home, MapPin, Plus } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type DeliveryAddressStepProps = {
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  orderNotes: string;
  onOrderNotesChange: (notes: string) => void;
};

export default function DeliveryAddressStep({
  selectedAddressId,
  onSelectAddress,
  orderNotes,
  onOrderNotesChange,
}: DeliveryAddressStepProps) {
  const { user, addAddress } = useAuth();

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

    if (!pincode.trim()) errs.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(pincode.trim())) errs.pincode = "Pincode must be 6 digits";

    if (!houseNumber.trim()) errs.houseNumber = "House/Flat number is required";
    if (!street.trim()) errs.street = "Street address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!stateName.trim()) errs.stateName = "State is required";

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAddress = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateAddress()) return;

    addAddress({
      name: user?.name || "User",
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
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-zinc-500" />
          <h2 className="text-base font-bold text-zinc-900 sm:text-lg">Deliver to</h2>
        </div>

        {!user ? (
          <div className="mt-4 rounded-xl border border-dashed border-zinc-300 p-5 text-center">
            <p className="text-sm font-medium text-zinc-700">Sign in to add a delivery address</p>
            <Link
              href="/auth/login"
              className="mt-3 inline-flex rounded-full bg-[#171a18] px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-700"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {user.addresses.map((address) => {
                const isSelected = address.id === selectedAddressId;

                return (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => onSelectAddress(address.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-zinc-950 bg-zinc-50"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                        isSelected ? "border-zinc-950" : "border-zinc-300"
                      }`}
                    >
                      {isSelected && <span className="size-2.5 rounded-full bg-zinc-950" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900">{address.name}</span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            address.type === "Work"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-[#fff6e8] text-[#b55d18]"
                          }`}
                        >
                          {address.type === "Work" ? (
                            <Briefcase size={10} />
                          ) : (
                            <Home size={10} />
                          )}
                          {address.type || "Home"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-zinc-600">
                        {address.houseNumber ? `${address.houseNumber}, ` : ""}
                        {address.street}
                      </p>
                      <p className="text-sm text-zinc-600">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">Phone: {address.phone || user.phone}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {isAddingAddress ? (
              <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900">Add New Delivery Address</h3>

                  <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setAddressType("Home")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        addressType === "Home"
                          ? "bg-zinc-950 text-white"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      <Home size={13} />
                      Home
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressType("Work")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        addressType === "Work"
                          ? "bg-zinc-950 text-white"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      <Briefcase size={13} />
                      Work
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      label="Pincode"
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(event) => setPincode(event.target.value.replace(/\D/g, ""))}
                      error={addressErrors.pincode}
                      placeholder="e.g. 560001"
                    />
                    <Input
                      label="House / Flat Number"
                      type="text"
                      value={houseNumber}
                      onChange={(event) => setHouseNumber(event.target.value)}
                      error={addressErrors.houseNumber}
                      placeholder="e.g. Flat 402, Building 3"
                    />
                  </div>

                  <Input
                    label="Street / Locality"
                    type="text"
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                    error={addressErrors.street}
                    placeholder="e.g. Highrise Heights, MG Road"
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      label="City"
                      type="text"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      error={addressErrors.city}
                      placeholder="e.g. Bengaluru"
                    />
                    <Input
                      label="State"
                      type="text"
                      value={stateName}
                      onChange={(event) => setStateName(event.target.value)}
                      error={addressErrors.stateName}
                      placeholder="e.g. Karnataka"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsAddingAddress(false);
                        setAddressErrors({});
                      }}
                      className="h-10 rounded-full px-4 text-xs font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="h-10 rounded-full bg-[#0f172a] px-6 text-xs font-semibold hover:bg-[#1e293b]"
                    >
                      Save Address
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingAddress(true)}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-zinc-300 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
              >
                <Plus size={15} />
                Add a new address
              </button>
            )}
          </>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-base font-bold text-zinc-900 sm:text-lg">
          Order Notes <span className="font-medium text-zinc-400">(Optional)</span>
        </h2>

        <textarea
          value={orderNotes}
          maxLength={200}
          onChange={(event) => onOrderNotesChange(event.target.value)}
          rows={3}
          placeholder="Add order notes (e.g. gate code, special delivery instructions...)"
          className="mt-3 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-800 focus:ring-2 focus:ring-zinc-100"
        />
        <p className="mt-1 text-right text-xs text-zinc-400">{orderNotes.length}/200</p>
      </div>
    </div>
  );
}
