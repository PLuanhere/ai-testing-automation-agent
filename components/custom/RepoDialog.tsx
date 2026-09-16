"use client";

import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import axios from 'axios';
import { Input } from '../ui/input';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Plus, Search, Github, GitBranch, Check, Loader2 } from 'lucide-react';

export type Repo = {
  id: number;
  name: string;
  full_name: string;
  private_: boolean;
  html_url: string;
  description: string;
  updated_at: string;
  language: string;
  default_branch: string;
  owner: string;
};

export default function RepoDialog({ setRefreshPage }: { setRefreshPage: (refresh: boolean) => void }) {
  const [repoList, setRepoList] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { userDetail } = useContext(UserDetailContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      GetRepoList();
    }
  }, [isOpen]);

  const GetRepoList = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get('/api/github/repos');
      setRepoList(result.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRepoList = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return repoList;
    return repoList.filter((r) => r.full_name.toLowerCase().includes(q));
  }, [searchTerm, repoList]);

  const SaveRepoToDB = async () => {
    if (!selectedRepo) return;
    setIsSaving(true);
    try {
      await axios.post('/api/user-repo', {
        repoId: selectedRepo.id,
        name: selectedRepo.name,
        full_name: selectedRepo.full_name,
        private: selectedRepo.private_,
        html_url: selectedRepo.html_url,
        description: selectedRepo.description,
        language: selectedRepo.language,
        default_branch: selectedRepo.default_branch,
        owner: selectedRepo.owner,
        userId: userDetail?.id,
      });

      setIsOpen(false);
      setRefreshPage(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger
        className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Repository
      </DialogTrigger>

      <DialogContent className="bg-[#0b120e] border border-emerald-500/30 text-white max-w-lg p-6 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Github className="w-5 h-5 text-emerald-400" />
            Add GitHub Repository
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Search your authorized GitHub repositories and import one into Agent QA.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search repositories by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50 border-white/10 pl-10 text-xs text-slate-200 placeholder:text-slate-500 h-10 rounded-xl focus-visible:ring-emerald-500"
            />
          </div>

          <div className="max-h-64 overflow-y-auto border border-emerald-500/20 rounded-xl bg-black/40 divide-y divide-white/5">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                Fetching your GitHub repositories...
              </div>
            ) : filteredRepoList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No repositories found matching your search.
              </div>
            ) : (
              filteredRepoList.map((repo) => {
                const isSelected = selectedRepo?.id === repo.id;
                return (
                  <div
                    key={repo.id}
                    onClick={() => setSelectedRepo(repo)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                        : 'text-slate-200 hover:bg-emerald-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <GitBranch className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <div className="text-xs">{repo.full_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {repo.default_branch} · {repo.language || 'Code'}
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 pt-2">
          <DialogClose className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 transition-colors">
            Cancel
          </DialogClose>
          <Button
            disabled={!selectedRepo || isSaving}
            onClick={SaveRepoToDB}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl shadow-md shadow-emerald-500/20 transition-all disabled:opacity-40 gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Importing...
              </>
            ) : (
              'Import Repository'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
