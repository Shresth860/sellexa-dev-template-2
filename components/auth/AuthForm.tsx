"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OtpInput } from "@/components/ui/OtpInput";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  User,
  Phone,
  Lock,
  ChevronDown,
  Loader2,
} from "lucide-react";

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
  const router = useRouter();

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

  const [fullName, setFullName] = useState("");
  const [emailInput, setEmailInput] = useState(pendingContact || "");
  const [phoneInput, setPhoneInput] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [isOtpStep, setIsOtpStep] = useState(false);
  const [inputError, setInputError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    terms?: string;
  }>({});

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

  const validateLogin = (): boolean => {
    const errors: { email?: string } = {};
    const trimmed = emailInput.trim();

    if (!trimmed) {
      errors.email = "Please enter your email address or mobile number";
    } else if (trimmed.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        errors.email = "Please enter a valid email address";
      }
    } else {
      const cleanPhone = trimmed.replace(/[\s\-\(\)\+]/g, "");
      if (!/^\d+$/.test(cleanPhone) || cleanPhone.length < 10 || cleanPhone.length > 12) {
        errors.email = "Please enter a valid email address or 10-digit mobile number";
      }
    }

    setFieldErrors(errors);
    setInputError(errors.email || "");
    return Object.keys(errors).length === 0;
  };

  const validateSignup = (): boolean => {
    const errors: { fullName?: string; email?: string; phone?: string; terms?: string } = {};

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      errors.fullName = "Please enter your full name";
    } else if (trimmedName.length < 2) {
      errors.fullName = "Name must be at least 2 characters long";
    } else if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
      errors.fullName = "Name can only contain letters and spaces";
    }

    const trimmedEmail = emailInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = "Please enter your email address";
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address (e.g. name@domain.com)";
    }

    const cleanPhone = phoneInput.replace(/[\s\-\(\)\+]/g, "");
    if (!phoneInput.trim()) {
      errors.phone = "Please enter your mobile number";
    } else if (!/^\d+$/.test(cleanPhone)) {
      errors.phone = "Mobile number must contain digits only";
    } else if (cleanPhone.length !== 10) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!agreedTerms) {
      errors.terms = "You must agree to the Terms & Conditions and Privacy Policy";
    }

    setFieldErrors(errors);
    const firstError = errors.fullName || errors.email || errors.phone || errors.terms || null;
    setInputError(firstError || "");
    return Object.keys(errors).length === 0;
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError("");
    setFieldErrors({});

    const isValid = activeMode === "signup" ? validateSignup() : validateLogin();
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const targetContact = emailInput.trim() || phoneInput.trim();
      setPendingContact(targetContact);
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
        setOtpError("Invalid verification code. Please try again.");
      }
    }, 700);
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "apple" | "phone") => {
    if (provider === "phone") {
      setIsOtpStep(true);
      return;
    }
    setIsLoading(true);
    await loginWithSocial(provider === "facebook" ? "google" : provider);
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
      <div className="py-6 px-4 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-14 h-14 text-[#5B8C1D] animate-bounce mb-3" />
        <h3 className="text-xl font-black text-zinc-950 mb-1 tracking-tight">
          Welcome to Sellexa!
        </h3>
        <p className="text-xs text-zinc-600">
          Your account has been authenticated successfully.
        </p>
      </div>
    );
  }

  if (isOtpStep) {
    return (
      <div className="flex flex-col items-center py-1 px-1 w-full max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setIsOtpStep(false)}
          className="self-start mb-4 p-1.5 -ml-1 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {activeMode === "login" ? "Login" : "Sign Up"}</span>
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#141613] flex items-center justify-center text-[#C5F237] mb-3 shadow-md shadow-zinc-900/10">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-1 tracking-tight">
          Verify OTP Code
        </h2>
        <p className="text-xs text-zinc-600 text-center mb-4 max-w-xs leading-relaxed">
          We've sent a 6-digit verification code to{" "}
          <span className="font-bold text-zinc-900">
            {pendingContact || emailInput || phoneInput || "your contact"}
          </span>
        </p>

        <div className="w-full mb-3 flex justify-center">
          <OtpInput
            length={6}
            onComplete={handleVerifyOtp}
            disabled={isLoading}
          />
        </div>

        {otpError && (
          <p className="text-xs text-red-500 mb-3 text-center font-medium">
            {otpError}
          </p>
        )}

        <div className="text-xs text-zinc-500 mb-4">
          Didn't receive the code?{" "}
          {resendTimer > 0 ? (
            <span className="font-semibold text-zinc-400">
              Resend in {resendTimer}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-[#5B8C1D] hover:underline cursor-pointer"
            >
              Resend code
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleVerifyOtp("123456")}
          className="w-full h-11 rounded-xl bg-[#C5F237] hover:bg-[#b7e825] text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-between px-5 shadow-xs transition-all cursor-pointer border border-[#b2e61f]"
        >
          <span>{isLoading ? "Verifying..." : "Verify & Continue"}</span>
          <span className="grid place-items-center w-7 h-7 rounded-full bg-zinc-950 text-white">
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      <div className="mb-3 lg:mb-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 tracking-tight mb-0.5">
          {activeMode === "login"
            ? "Login to your account"
            : "Create your account"}
        </h2>
        <p className="text-xs text-zinc-500">
          {activeMode === "login"
            ? "Enter your details to continue"
            : "Fill in the details below to get started"}
        </p>
      </div>



      <form noValidate onSubmit={handleSendOtp} className="space-y-2.5">
        {activeMode === "signup" && (
          <div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                className={`w-full h-10.5 pl-10 pr-3.5 rounded-xl border text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 bg-white transition-all outline-none ${
                  fieldErrors.fullName
                    ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                }`}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium pl-1">
                {fieldErrors.fullName}
              </p>
            )}
          </div>
        )}

        <div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={activeMode === "login" ? "Email address or mobile number" : "Email address"}
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={`w-full h-10.5 pl-10 pr-3.5 rounded-xl border text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 bg-white transition-all outline-none ${
                fieldErrors.email
                  ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium pl-1">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {activeMode === "signup" && (
          <div>
            <div className="flex gap-2">
              <div className="relative flex items-center">
                <div className="h-10.5 px-2.5 flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-700 select-none">
                  <span className="text-sm">🇮🇳</span>
                  <span>{countryCode}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </div>
              </div>
              <div className="relative flex-1">
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  className={`w-full h-10.5 px-3.5 rounded-xl border text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 bg-white transition-all outline-none ${
                    fieldErrors.phone
                      ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                      : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  }`}
                />
              </div>
            </div>
            {fieldErrors.phone && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium pl-1">
                {fieldErrors.phone}
              </p>
            )}
          </div>
        )}

        {activeMode === "signup" && (
          <div>
            <div className="flex items-start gap-2 pt-0.5">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={agreedTerms}
                onChange={(e) => {
                  setAgreedTerms(e.target.checked);
                  setFieldErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                className="mt-0.5 w-3.5 h-3.5 rounded border-zinc-300 text-[#5B8C1D] focus:ring-[#5B8C1D] cursor-pointer"
              />
              <label htmlFor="terms-checkbox" className="text-[11px] text-zinc-600 leading-tight cursor-pointer select-none">
                I agree to the{" "}
                <a href="#terms" className="font-bold text-zinc-900 hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#privacy" className="font-bold text-zinc-900 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {fieldErrors.terms && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium pl-1">
                {fieldErrors.terms}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-11.5 rounded-xl bg-[#C5F237] hover:bg-[#b7e825] text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-between px-5 shadow-xs hover:shadow-sm transition-all cursor-pointer border border-[#b2e61f] mt-2 sm:mt-3 group"
        >
          <span>
            {isLoading
              ? "Sending OTP..."
              : activeMode === "login"
                ? "Login"
                : "Create Account"}
          </span>
          <span className="grid place-items-center w-7 h-7 rounded-full bg-zinc-950 text-white group-hover:scale-105 transition-transform">
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </span>
        </button>
      </form>

      <div className="relative my-3 lg:my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200" />
        </div>
        <span className="relative px-3 text-[11px] font-medium text-zinc-400 bg-white">
          {activeMode === "login" ? "or continue with" : "or sign up with"}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3 lg:mb-4">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="h-10 sm:h-10.5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center transition-all cursor-pointer"
          title="Google"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          className="h-10 sm:h-10.5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center transition-all cursor-pointer"
          title="Facebook"
        >
          <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin("apple")}
          className="h-10 sm:h-10.5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center transition-all cursor-pointer"
          title="Apple"
        >
          <svg className="w-4 h-4 fill-zinc-950" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.03-1.77.91-2.8-.89.04-1.98.6-2.61 1.34-.56.65-.99 1.7-0.86 2.71 1 .08 2.01-.51 2.56-1.25z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin("phone")}
          className="h-10 sm:h-10.5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center transition-all cursor-pointer text-zinc-800"
          title="Phone OTP"
        >
          <Phone className="w-4 h-4 text-zinc-700" />
        </button>
      </div>

      <div className="text-center text-xs text-zinc-600 font-medium">
        {activeMode === "login" ? (
          <span>
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              onClick={() => {
                if (closeAuthModal) closeAuthModal();
              }}
              className="font-extrabold text-[#5B8C1D] hover:underline ml-0.5 cursor-pointer"
            >
              Sign up
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
              className="font-extrabold text-[#5B8C1D] hover:underline ml-0.5 cursor-pointer"
            >
              Login
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}
