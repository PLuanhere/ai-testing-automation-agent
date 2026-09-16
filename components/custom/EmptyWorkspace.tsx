import React from 'react';
import { Button } from '../ui/button';
import { Github, Sparkles, Globe, ArrowRight, GitBranch } from 'lucide-react';

interface EmptyWorkspaceProps {
  onConnect?: () => void;
}

export default function EmptyWorkspace({ onConnect }: EmptyWorkspaceProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-xl mx-auto">
      {/* Animated Icon Mesh */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
          <GitBranch className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
        No Repositories Connected Yet
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed mb-8">
        Connect your GitHub repository to enable Agent QA to crawl routes, synthesize automated Playwright test specs, and execute them on Browserbase cloud browsers.
      </p>

      {/* Quick 3-Step Preview */}
      <div className="grid grid-cols-3 gap-3 w-full mb-8 text-left">
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">01. Connect</div>
          <div className="text-xs text-slate-300">OAuth GitHub Repo</div>
        </div>
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">02. Synthesize</div>
          <div className="text-xs text-slate-300">AI Test Generation</div>
        </div>
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">03. Run</div>
          <div className="text-xs text-slate-300">Cloud Browserbase</div>
        </div>
      </div>

      {onConnect && (
        <Button
          onClick={onConnect}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all gap-2"
        >
          <Github className="w-4 h-4" />
          Connect Repository Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}