"use client";

import React, { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Button } from '../ui/button';
import EmptyWorkspace from './EmptyWorkspace';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import RepoDialog from './RepoDialog';
import UserRepoList from './UserRepoList';
import { Github, Plus, GitBranch, Coins, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export type UserRepo = {
  id: number;
  repoId: number;
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
  description: string;
  userId: number;
  owner: string;
  language: string;
  defaultBranch: string;
  targetDomain?: string;
  globalInstruction?: string;
};

export default function WorkspaceBody() {
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [userRepoList, setUserRepoList] = useState<UserRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetGithubUserToken();
  }, []);

  useEffect(() => {
    if (userDetail?.id) {
      GetUserAddedRepoList();
    }
  }, [userDetail?.id]);

  const GetGithubUserToken = async () => {
    try {
      const result = await axios.get('/api/github/token');
      setIsGithubConnected(result.data.connected);
    } catch (e) {
      console.error(e);
    }
  };

  const OnAddRepo = async () => {
    router.push('/api/github');
  };

  const GetUserAddedRepoList = async () => {
    if (userRepoList.length === 0) {
      setIsLoading(true);
    }
    try {
      const result = await axios.get('/api/user-repo?userId=' + userDetail?.id);
      setUserRepoList(result.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── HEADER TITLE & STATS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Repositories & Test Suites
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your connected codebases, configure target domains, and trigger AI test runs.
          </p>
        </div>

        {/* Quick summary pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0c140f] border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-300 shadow-sm">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span>{userRepoList.length} Connected Repos</span>
          </div>

          {userDetail && (
            <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs font-mono text-emerald-300 shadow-sm">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userDetail.credit ?? 0} Credits</span>
            </div>
          )}
        </div>
      </div>

      {/* ── GITHUB INTEGRATION CARD ── */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-[#0c1610] via-[#09120c] to-[#070e09] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-white shadow-inner">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">GitHub Integration</h2>
              {isGithubConnected ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  <AlertCircle className="w-3 h-3" />
                  Action Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isGithubConnected
                ? "Your GitHub account is connected. Import any repository to synthesize tests."
                : "Authorize GitHub access to crawl AST routes and trigger automated test suites."}
            </p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          {!isGithubConnected ? (
            <Button
              onClick={OnAddRepo}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all gap-2"
            >
              <Github className="w-4 h-4" />
              Connect GitHub
            </Button>
          ) : (
            <RepoDialog setRefreshPage={() => GetUserAddedRepoList()} />
          )}
        </div>
      </div>

      {/* ── REPOSITORIES SECTION ── */}
      <div>
        {isLoading ? (
          <div className="rounded-2xl border border-emerald-500/15 bg-[#0d1611]/60 p-12 text-center text-slate-400 font-mono text-sm flex items-center justify-center gap-3">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            Loading repositories and test runs...
          </div>
        ) : userRepoList.length === 0 ? (
          <div className="rounded-2xl border border-emerald-500/15 bg-[#0d1611]/50 shadow-lg">
            <EmptyWorkspace onConnect={!isGithubConnected ? OnAddRepo : undefined} />
          </div>
        ) : (
          <UserRepoList repoList={userRepoList} setReload={() => GetUserAddedRepoList()} />
        )}
      </div>
    </div>
  );
}
