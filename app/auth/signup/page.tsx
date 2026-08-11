"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthSignupPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen sm:min-h-svh flex-1 flex flex-col items-center justify-center p-4 bg-zinc-50/50 overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-xl shadow-zinc-200/50">
        <AuthForm onSuccess={handleSuccess} mode="signup" />
      </div>
    </div>
  );
}
