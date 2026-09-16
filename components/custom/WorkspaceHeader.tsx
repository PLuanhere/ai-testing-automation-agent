"use client";

import { UserButton } from '@clerk/nextjs';
import React, { useContext } from 'react';
import Link from 'next/link';
import { UserDetailContext } from '@/context/UserDetailContext';
import Logo from './Logo';
import { Coins, Layers, HelpCircle, CreditCard, ArrowUpRight } from 'lucide-react';

export default function WorkspaceHeader() {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080c0a]/90 backdrop-blur-xl border-b border-emerald-500/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Workspace Breadcrumb */}
        <div className="flex items-center gap-4">
          <Logo size="md" variant="dark" href="/workspace" />
          <span className="hidden sm:inline-block text-slate-600">/</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
            Console
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-black/40 border border-emerald-500/15 rounded-full px-3 py-1">
          <Link
            href="/workspace"
            className="text-xs font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full transition-all"
          >
            Repositories
          </Link>
          <Link
            href="/#features"
            className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1 rounded-full transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#faq"
            className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1 rounded-full transition-colors"
          >
            Docs & FAQ
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1 rounded-full transition-colors inline-flex items-center gap-1"
          >
            Landing <ArrowUpRight className="w-3 h-3" />
          </Link>
        </nav>

        {/* User & Credits Info */}
        <div className="flex items-center gap-3">
          {userDetail && (
            <div className="inline-flex items-center gap-2 bg-emerald-950/50 text-emerald-300 px-3 py-1 rounded-full text-xs font-mono font-medium border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userDetail.credit ?? 0} Credits</span>
            </div>
          )}

          <div className="flex items-center pl-1 border-l border-white/10">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full border border-emerald-500/30",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}