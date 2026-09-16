"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "light" | "dark" | "auto";
  href?: string;
  asLink?: boolean;
  className?: string;
}

const sizeMap = {
  sm: {
    iconSize: 22,
    textSize: "text-base",
    badgeSize: "text-[10px] px-1.5 py-0.5",
    gap: "gap-2",
  },
  md: {
    iconSize: 26,
    textSize: "text-lg",
    badgeSize: "text-xs px-2 py-0.5",
    gap: "gap-2.5",
  },
  lg: {
    iconSize: 34,
    textSize: "text-2xl",
    badgeSize: "text-sm px-2.5 py-1",
    gap: "gap-3",
  },
  xl: {
    iconSize: 44,
    textSize: "text-3xl",
    badgeSize: "text-base px-3 py-1",
    gap: "gap-3.5",
  },
};

export function LogoIcon({
  size = 26,
  variant = "auto",
  className = "",
}: {
  size?: number;
  variant?: "light" | "dark" | "auto";
  className?: string;
}) {
  const isDark = variant === "dark";
  const chevronStroke = isDark
    ? "#F8FAFC"
    : variant === "light"
    ? "#0F172A"
    : "currentColor";

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 ${className}`}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="agentQaGrad" x1="6" y1="24" x2="28" y2="7" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="60%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        {/* Agent 'A' Frame (Clean geometric chevron) */}
        <path
          d="M6 25L16 5L26 25"
          stroke={chevronStroke}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={variant === "auto" ? "stroke-slate-900 dark:stroke-slate-100" : ""}
        />

        {/* QA Checkmark (Dynamic quality assurance verification) */}
        <path
          d="M6 16.5L13.5 24L28 7.5"
          stroke="url(#agentQaGrad)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Apex Agent Intelligence Node */}
        <circle cx="16" cy="5" r="1.8" fill="#10B981" />
      </svg>
    </div>
  );
}

export default function Logo({
  size = "md",
  showText = true,
  variant = "auto",
  href = "/",
  asLink = true,
  className = "",
}: LogoProps) {
  const conf = sizeMap[size];
  const isDark = variant === "dark";
  const agentColor = isDark
    ? "text-white"
    : variant === "light"
    ? "text-slate-900"
    : "text-slate-900 dark:text-white";

  const content = (
    <div
      className={`group inline-flex items-center ${conf.gap} select-none cursor-pointer ${className}`}
    >
      <LogoIcon size={conf.iconSize} variant={variant} />

      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-bold tracking-tight transition-colors duration-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 ${conf.textSize} ${agentColor}`}
            style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            Agent
          </span>
          <span
            className={`font-black tracking-tight text-emerald-600 dark:text-emerald-400 ${conf.textSize}`}
            style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            QA
          </span>
        </div>
      )}
    </div>
  );

  if (asLink && href) {
    return (
      <Link href={href} className="inline-block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
