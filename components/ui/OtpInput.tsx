"use client";

import React, { useRef, useState, useEffect } from "react";

export interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export function OtpInput({
  length = 6,
  onComplete,
  disabled = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue.length === 0) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const char = numericValue[numericValue.length - 1];
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (index < length - 1 && char) {
      inputRefs.current[index + 1]?.focus();
    }

    const code = newOtp.join("");
    if (code.length === length && !newOtp.includes("")) {
      onComplete(code);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/[^0-9]/g, "")
      .slice(0, length);

    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const code = newOtp.join("");
      if (code.length === length && !newOtp.includes("")) {
        onComplete(code);
      }
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border bg-white text-zinc-900 transition-all duration-200 outline-none select-none
            ${
              digit
                ? "border-zinc-800 ring-2 ring-zinc-100 bg-zinc-50/50"
                : "border-zinc-200 hover:border-zinc-300 focus:border-zinc-800 focus:ring-2 focus:ring-zinc-100"
            }
            ${disabled ? "bg-zinc-100 cursor-not-allowed text-zinc-400" : ""}
          `}
        />
      ))}
    </div>
  );
}
