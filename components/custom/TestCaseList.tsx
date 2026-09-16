"use client";

import React, { useState } from 'react';
import { TestCase } from './UserRepoList';
import { Checkbox } from '../ui/checkbox';
import { Play, RefreshCw, CheckCircle2, XCircle, Clock, CheckSquare, Square } from 'lucide-react';
import { Button } from '../ui/button';
import TestCaseSettingDialog from './TestCaseSettingDialog';
import TestExecutionModal from './TestCaseExecutionModel';

type Props = {
  testCase: TestCase[];
  onReload: (repoId: number) => void;
  repository: any;
};

export default function TestCaseList({ testCase, onReload, repository }: Props) {
  const [selectedTestCases, setSelectedTestCases] = useState<TestCase[]>([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSelectedTestCase = (checked: boolean | string, item: TestCase) => {
    if (checked) {
      setSelectedTestCases((prev) => [...prev, item]);
    } else {
      setSelectedTestCases((prev) => prev.filter((tc) => tc.id !== item.id));
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedTestCases.length === testCase.length) {
      setSelectedTestCases([]);
    } else {
      setSelectedTestCases([...testCase]);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onReload(repository?.repoId);
    setIsRefreshing(false);
  };

  const allSelected = testCase.length > 0 && selectedTestCases.length === testCase.length;

  return (
    <div className="space-y-3">
      {/* List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-sm text-slate-200">
            Synthesized Test Scenarios
          </h4>
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
            {testCase.length} Total
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleSelectAll}
            className="text-xs border-white/10 bg-black/40 text-slate-300 hover:text-white hover:bg-white/5 h-8 gap-1.5"
          >
            {allSelected ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            onClick={handleRefresh}
            className="text-xs border-white/10 bg-black/40 text-slate-300 hover:text-white hover:bg-white/5 h-8 gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Test Cases Table / List */}
      <div className="rounded-xl border border-emerald-500/15 bg-black/40 overflow-hidden shadow-inner divide-y divide-white/5">
        {testCase.map((tc) => {
          const isSelected = selectedTestCases.some((item) => item.id === tc.id);

          return (
            <div
              key={tc.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isSelected ? 'bg-emerald-500/[0.04]' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="pt-0.5">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectedTestCase(checked, tc)}
                    className="border-emerald-500/40 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200 tracking-tight">
                    {tc.title}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {tc.description}
                  </p>
                  {tc.targetRoute && (
                    <span className="font-mono text-[10px] text-emerald-400/80 mt-1 inline-block">
                      Route: {tc.targetRoute}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pl-7 sm:pl-0 shrink-0">
                {tc.type && (
                  <span className="font-mono text-[10px] text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                    {tc.type}
                  </span>
                )}

                {tc.status === 'passed' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    PASSED
                  </span>
                )}

                {tc.status === 'failed' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-red-400 bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded">
                    <XCircle className="w-3 h-3 text-red-400" />
                    FAILED
                  </span>
                )}

                {tc.status === 'running' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    RUNNING
                  </span>
                )}

                {(!tc.status || tc.status === 'idle') && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900 border border-white/10 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-slate-500" />
                    PENDING
                  </span>
                )}

                <TestCaseSettingDialog testCase={tc} setReload={() => onReload(repository?.repoId)} />
              </div>
            </div>
          );
        })}

        {/* Bottom Execution Bar */}
        <div className="p-4 bg-gradient-to-r from-[#09120c] to-[#070d09] border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-300">
            <span className="text-emerald-400 font-bold">{selectedTestCases.length}</span> of{' '}
            <span className="text-slate-400">{testCase.length}</span> tests selected for execution
          </div>

          <Button
            disabled={selectedTestCases.length === 0}
            onClick={() => setIsModelOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all gap-2 disabled:opacity-40"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run {selectedTestCases.length > 0 ? `${selectedTestCases.length} Selected Tests` : 'Tests'}
          </Button>
        </div>
      </div>

      <TestExecutionModal
        testCases={selectedTestCases}
        repository={repository}
        isOpen={isModelOpen}
        onClose={() => {
          setIsModelOpen(false);
          onReload(repository?.repoId);
        }}
      />
    </div>
  );
}