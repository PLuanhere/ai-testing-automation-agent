"use client";

import React, { useContext, useState } from 'react';
import { UserRepo } from './WorkspaceBody';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  CheckCircle2,
  Globe,
  ListChecks,
  Loader2,
  Sparkles,
  TrendingUp,
  XCircle,
  Github,
  GitBranch,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { Button } from '../ui/button';
import axios from 'axios';
import { UserDetailContext } from '@/context/UserDetailContext';
import TestCaseList from './TestCaseList';
import RepoSettings from './RepoSettings';

type Props = {
  repoList: UserRepo[];
  setReload: () => void;
};

export type TestCase = {
  id: number;
  title: string;
  description: string;
  type: string;
  repoId: number;
  targetFiles: string[];
  expectedResult: string;
  repoName: string;
  repoOwner: string;
  targetRoute: string;
  status: string;
  browserbaseScript: string;
};

type StatusData = {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
};

export default function UserRepoList({ repoList, setReload }: Props) {
  const [statusData, setStatusData] = useState<StatusData>({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    passRate: 0,
  });

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [testCaseLoading, setTestCaseLoading] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const handleGenerateTestCases = async (repo: UserRepo) => {
    setLoading(true);
    try {
      const result = await axios.post('/api/generate-test-cases', {
        userId: userDetail?.id,
        repoId: repo?.repoId,
        owner: repo.owner,
        repo: repo.name,
        branch: repo.defaultBranch,
      });

      if (result.data.credits !== undefined) {
        setUserDetail({ ...userDetail, credit: result.data.credits });
      }

      GetTestCases(repo.repoId);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to generate test cases');
    } finally {
      setLoading(false);
    }
  };

  const GetTestCases = async (repoId: number) => {
    setTestCaseLoading(true);
    setTestCases([]);
    try {
      const result = await axios.get(`/api/test-cases?repoId=${repoId}`);
      const userTestCase = (result.data as TestCase[]) || [];
      const passedTests = userTestCase.filter((tc) => tc.status === 'passed').length;
      const failedTests = userTestCase.filter((tc) => tc.status === 'failed').length;
      const passRate = userTestCase.length
        ? Math.round((passedTests / userTestCase.length) * 100)
        : 0;

      setStatusData({
        totalTests: userTestCase.length,
        passedTests,
        failedTests,
        passRate,
      });

      setTestCases(userTestCase);
    } catch (e) {
      console.error(e);
    } finally {
      setTestCaseLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
          Connected Repositories ({repoList.length})
        </h2>
      </div>

      <Accordion
        className="w-full space-y-4"
        onValueChange={(value: any) => {
          if (value) GetTestCases(Number(value));
        }}
      >
        {repoList.map((repo) => (
          <AccordionItem
            key={repo.repoId}
            value={repo.repoId.toString()}
            className="border border-emerald-500/20 bg-gradient-to-b from-[#0e1712] to-[#0a110d] rounded-2xl px-5 py-2 shadow-lg hover:border-emerald-500/40 transition-all"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center justify-between w-full pr-4 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      {repo.fullName}
                      {repo.private && (
                        <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                          Private
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        <GitBranch className="w-3 h-3" />
                        {repo.defaultBranch || 'main'}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Code2 className="w-3 h-3 text-cyan-400" />
                        {repo.language || 'TypeScript'}
                      </span>
                    </div>
                  </div>
                </div>

                {repo.targetDomain && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400/90 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    {repo.targetDomain}
                  </span>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="pt-4 pb-2 space-y-6">
                {/* Domain & Settings Bar */}
                <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Target Web App Domain:</span>
                      <div className="text-sm font-mono font-semibold text-emerald-300">
                        {repo?.targetDomain ? (
                          <a
                            href={repo.targetDomain.startsWith('http') ? repo.targetDomain : `https://${repo.targetDomain}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline inline-flex items-center gap-1"
                          >
                            {repo.targetDomain}
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        ) : (
                          <span className="text-amber-400 font-sans text-xs">
                            Not configured (Click settings to set base URL)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <RepoSettings repo={repo} setReload={setReload} />
                </div>

                {/* 4 Status Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatusCard
                    title="Total Test Cases"
                    value={statusData.totalTests}
                    icon={<ListChecks className="w-5 h-5 text-cyan-400" />}
                    accentColor="text-cyan-400"
                    glow="from-cyan-500/10"
                  />
                  <StatusCard
                    title="Passed Tests"
                    value={statusData.passedTests}
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    accentColor="text-emerald-400"
                    glow="from-emerald-500/10"
                  />
                  <StatusCard
                    title="Failed Tests"
                    value={statusData.failedTests}
                    icon={<XCircle className="w-5 h-5 text-red-400" />}
                    accentColor="text-red-400"
                    glow="from-red-500/10"
                  />
                  <StatusCard
                    title="Pass Rate"
                    value={`${statusData.passRate}%`}
                    icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
                    accentColor="text-purple-400"
                    glow="from-purple-500/10"
                  />
                </div>

                {/* Test Cases List or Generator Prompt */}
                {testCaseLoading ? (
                  <div className="p-8 text-center rounded-xl bg-black/30 border border-emerald-500/15 flex items-center justify-center gap-3 text-slate-400 font-mono text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    Fetching synthesized test cases...
                  </div>
                ) : testCases.length > 0 ? (
                  <TestCaseList
                    testCase={testCases}
                    onReload={(repoId: number) => GetTestCases(repoId)}
                    repository={repo}
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/20 rounded-xl p-5 bg-gradient-to-r from-emerald-950/20 via-black/40 to-black/40 shadow-inner">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        {loading ? 'Synthesizing Test Cases...' : 'Synthesize AI Test Cases'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xl">
                        Agent QA will crawl your Next.js routes, server components, and interactive forms to generate automated Playwright specifications.
                      </p>
                    </div>

                    <Button
                      disabled={loading}
                      onClick={() => handleGenerateTestCases(repo)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all gap-2 shrink-0"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Crawling Repo...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate AI Test Suite
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function StatusCard({
  title,
  value,
  icon,
  accentColor,
  glow,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string;
  glow: string;
}) {
  return (
    <div className={`border border-white/10 rounded-xl p-4 bg-gradient-to-br ${glow} to-black/50 backdrop-blur-md flex items-center justify-between shadow-sm`}>
      <div>
        <p className="text-xs text-slate-400 font-medium">{title}</p>
        <h3 className={`text-2xl font-bold font-mono mt-1 ${accentColor}`}>{value}</h3>
      </div>
      <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  );
}
