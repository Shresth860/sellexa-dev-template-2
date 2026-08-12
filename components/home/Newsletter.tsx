"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!isValid) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  };

  return (
    <section
      id="new"
      className="mx-auto flex w-[calc(100%-28px)] max-w-[1720px] flex-col gap-7 border-t border-zinc-200 py-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between"
    >
      {/* Content */}
      <div>
        <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-zinc-500">
          Stay in the loop
        </span>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
          Good finds, straight to you.
        </h2>

        <p className="mt-2 max-w-xl text-xs text-zinc-500">
          Get first access to new arrivals, limited drops,
          and offers worth knowing about.
        </p>
      </div>

      {/* Subscription Form */}
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[400px] flex-col gap-2"
      >
        <div className="flex h-[52px] rounded-xl border border-zinc-200 bg-white p-1">
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="Your email address"
            aria-label="Email address"
            className="min-w-0 flex-1 bg-transparent px-3 text-xs outline-none placeholder:text-zinc-400"
          />

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#171a18] px-4 text-[10px] font-extrabold text-white transition hover:bg-zinc-700"
          >
            Subscribe

            <ArrowRight size={15} />
          </button>
        </div>

        {status === "success" && (
          <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
            <Check size={12} />
            Thanks! You’re on the list.
          </p>
        )}

        {status === "error" && (
          <p className="text-[10px] font-medium text-red-500">Please enter a valid email address.</p>
        )}
      </form>
    </section>
  );
}