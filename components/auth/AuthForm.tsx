"use client";

import  { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OtpInput } from "@/components/ui/OtpInput";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export interface AuthFormProps {
  onSuccess?: () => void;
  mode?: "login" | "signup";
  initialView?: "login" | "signup" | "otp";
}

export function AuthForm({
  onSuccess,
  mode,
  initialView,
}: AuthFormProps) {
  const pathname = usePathname();
  const isSignupPath = pathname === "/auth/signup";
  const activeMode: "login" | "signup" = mode
    ? mode
    : isSignupPath || initialView === "signup"
    ? "signup"
    : "login";

  const {
    closeAuthModal,
    pendingContact,
    setPendingContact,
    loginWithOtp,
    loginWithSocial,
  } = useAuth();

  const [isOtpStep, setIsOtpStep] = useState(false);
  const [contactInput, setContactInput] = useState(pendingContact || "");
  const [inputError, setInputError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isSuccess, setIsSuccess] = useState(false);


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpStep && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpStep, resendTimer]);

  const validateContact = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) {
      return "Please enter your email or phone number";
    }

    const cleanPhone = trimmed.replace(/[\s\-\(\)\+]/g, "");
    const isNumeric = /^\d+$/.test(cleanPhone);

    if (isNumeric) {
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        return "Please enter a valid 10-digit phone number";
      }
      return null;
    }

    if (trimmed.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return "Please enter a valid email address";
      }
      return null;
    }

    if (trimmed.length < 3) {
      return "Please enter a valid email or phone number";
    }

    return null;
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError(""); 

    const validationError = validateContact(contactInput);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPendingContact(contactInput.trim());
      setResendTimer(30);
      setIsOtpStep(true);
    }, 600);
  };

  const handleVerifyOtp = async (code: string) => {
    setOtpError("");
    setIsLoading(true);

    setTimeout(async () => {
      const success = await loginWithOtp(code);
      setIsLoading(false);
      if (success) {
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setOtpError("Invalid code. Please try again.");
      }
    }, 700);
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setIsLoading(true);
    await loginWithSocial(provider);
    setIsLoading(false);
    if (onSuccess) onSuccess();
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtpError("");
  };

  if (isSuccess) {
    return (
      <div className="py-8 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce mb-4" />
        <h3 className="text-xl font-bold text-zinc-900 mb-1">
          Welcome to Sellexa!
        </h3>
        <p className="text-sm text-zinc-500">
          You have successfully logged in.
        </p>
      </div>
    );
  }

  if (isOtpStep) {
    return (
      <div className="flex flex-col items-center pt-2 pb-2 px-2 w-full max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => setIsOtpStep(false)}
          className="self-start -ml-2 mb-4 p-2 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-pink-600/20">
          <svg
            className="w-9 h-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          > 
            <circle cx="12" cy="12" r="9" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.6 9h16.8M3.6 15h16.8M12 3v18"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-zinc-900 mb-1 tracking-tight">
          Verify code
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 text-center mb-6 max-w-xs">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-zinc-900">
            {pendingContact || contactInput}
          </span>
        </p>

        <div className="w-full mb-4">
          <OtpInput
            length={6}
            onComplete={handleVerifyOtp}
            disabled={isLoading}
          />
        </div>

        {otpError && (
          <p className="text-xs text-red-500 mb-4 text-center font-medium">
            {otpError}
          </p>
        )}

        <div className="text-xs text-zinc-500 mb-6">
          Didn't receive code?{" "}
          {resendTimer > 0 ? (
            <span className="font-medium text-zinc-400">
              Resend in {resendTimer}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-zinc-900 hover:underline cursor-pointer"
            >
              Resend code
            </button>
          )}
        </div>

        <Button
          fullWidth
          isLoading={isLoading}
          onClick={() => handleVerifyOtp("123456")}
          className="h-12 text-sm font-semibold rounded-full bg-[#0f172a]"
        >
          Verify & Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-1 px-1 w-full max-w-sm mx-auto">
      <div className="w-14 h-14 rounded-full bg-pink-600 flex items-center justify-center text-white mb-3 shadow-md shadow-pink-600/20">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.6 9h16.8M3.6 15h16.8M12 3v18"
          />
        </svg>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
        {activeMode === "login" ? "Welcome back" : "Create your account"}
      </h2>

      <div className="w-full flex flex-col gap-2.5 mb-3">
        <Button
          variant="outline"
          fullWidth
          disabled={isLoading}
          onClick={() => handleSocialLogin("google")}
          className="h-11 rounded-full border-zinc-200 hover:border-zinc-300 font-medium text-zinc-700 bg-white text-sm"
          leftIcon={
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.39 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.98 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          }
        >
          Continue with Google
        </Button>

        <Button
          variant="outline"
          fullWidth
          disabled={isLoading}
          onClick={() => handleSocialLogin("apple")}
          className="h-11 rounded-full border-zinc-200 hover:border-zinc-300 font-medium text-zinc-800 bg-white text-sm"
          leftIcon={
            <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.03-1.77.91-2.8-.89.04-1.98.6-2.61 1.34-.56.65-.99 1.7-0.86 2.71 1 .08 2.01-.51 2.56-1.25z" />
            </svg>
          }
        >
          Continue with Apple
        </Button>
      </div>

      <div className="w-full flex items-center my-3">
        <div className="flex-1 border-t border-zinc-200"></div>
        <span className="px-3 text-xs text-zinc-400 font-normal">or</span>
        <div className="flex-1 border-t border-zinc-200"></div>
      </div>

      <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-3">
        <Input
          type="text"
          placeholder="Enter email or phone number"
          value={contactInput}
          onChange={(e) => setContactInput(e.target.value)}
          error={inputError}
          className="h-11 rounded-2xl border-zinc-200 text-zinc-800 placeholder:text-zinc-400 text-sm"
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="h-11 text-sm font-medium rounded-full bg-[#0b0e17] hover:bg-[#181d2c] text-white shadow-sm mt-1"
        >
          Continue
        </Button>
      </form>

      <p className="text-xs text-zinc-400 text-center mt-4 leading-relaxed max-w-xs">
        By continuing, you agree to our{" "}
        <a href="#" className="underline text-zinc-600 hover:text-zinc-900">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline text-zinc-600 hover:text-zinc-900">
          Privacy Policy
        </a>
        .
      </p>

      <div className="mt-4 text-xs text-zinc-600">
        {activeMode === "login" ? (
          <span>
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              onClick={() => {
                if (closeAuthModal) closeAuthModal();
              }}
              className="font-semibold text-zinc-900 hover:underline cursor-pointer ml-0.5"
            >
              Sign Up
            </Link>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              onClick={() => {
                if (closeAuthModal) closeAuthModal();
              }}
              className="font-semibold text-zinc-900 hover:underline cursor-pointer ml-0.5"
            >
              Log In
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}
