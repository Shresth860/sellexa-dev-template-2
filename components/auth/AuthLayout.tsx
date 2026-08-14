"use client";

import { AuthHeroVisual } from "@/components/auth/AuthHeroVisual";
import { AuthForm } from "@/components/auth/AuthForm";
import { Shield, Headphones, RotateCcw } from "lucide-react";

interface AuthLayoutProps {
  mode: "login" | "signup";
}

export function AuthLayout({ mode }: AuthLayoutProps) {
  return (
    <div className="h-screen w-full bg-[#FAF9F5] flex flex-col justify-between items-center p-2 sm:p-4 lg:p-6 font-sans overflow-y-auto lg:overflow-hidden select-none">
      <div className="w-full max-w-[1240px] h-auto lg:h-full max-h-[920px] bg-[#FAF9F5] lg:bg-white rounded-2xl sm:rounded-3xl lg:rounded-[32px] border border-transparent lg:border-zinc-200/80 shadow-none lg:shadow-xl lg:shadow-zinc-900/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between bg-[#FAF9F5] p-3 sm:p-5 lg:p-8 border-b lg:border-b-0 lg:border-r border-zinc-200/60 relative overflow-hidden">
          <AuthHeroVisual mode={mode} hideFooterBadgesOnMobile={true} />
        </div>

        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center p-4 sm:p-6 lg:p-8 bg-white rounded-2xl lg:rounded-none shadow-lg lg:shadow-none border border-zinc-200/80 lg:border-none my-2 lg:my-0 overflow-y-auto lg:overflow-visible">
          <AuthForm mode={mode} />
        </div>
      </div>

      <div className="w-full max-w-[1240px] pt-3 pb-1 flex lg:hidden items-center justify-around text-center text-[10px] sm:text-[11px] text-zinc-600 font-medium border-t border-zinc-200/60 mt-2 shrink-0">
        <div className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[#5B8C1D]" />
          <span>100% Secure</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-zinc-300" />
        <div className="flex items-center gap-1">
          <Headphones className="w-3.5 h-3.5 text-indigo-600" />
          <span>24/7 Support</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-zinc-300" />
        <div className="flex items-center gap-1">
          <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
          <span>7-Day Returns</span>
        </div>
      </div>
    </div>
  );
}
