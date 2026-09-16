import WorkspaceHeader from '@/components/custom/WorkspaceHeader';
import React from 'react';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080c0a] text-slate-100 relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300 font-sans">
      {/* Background Matrix & Subtle Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[400px] rounded-full bg-emerald-500/8 blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/6 blur-[150px]" />
      </div>

      {/* Header */}
      <div className="relative z-20">
        <WorkspaceHeader />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}