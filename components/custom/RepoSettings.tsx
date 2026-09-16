import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Settings2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { UserRepo } from './WorkspaceBody'
import axios from 'axios'

type props = {
    repo: UserRepo,
    setReload: () => void;
}

function RepoSettings({ repo, setReload }: props) {

    const [isOpen, setIsOpen] = useState(false);

    const [repoSettings, setRepoSettings] = useState({
        targetDomain: repo?.targetDomain || '',
        globalInstruction: repo?.globalInstruction || ''
    })

    const handleSaveSettings = async () => {
        const result = await axios.post('/api/user-repo/settings', {
            repoId: repo.repoId,
            targetDomain: repoSettings.targetDomain,
            globalInstruction: repoSettings.globalInstruction
        })
        console.log(" result ", result?.data);
        setIsOpen(false);
        setReload();
    }
    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger>
                <Button 
                    variant="outline"
                    className="h-8 gap-1.5 border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-200 text-xs font-medium rounded-lg transition-all"
                >
                    <Settings2 className='h-3.5 w-3.5 text-emerald-400' /> Project Config
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-2xl bg-[#0b120e] border border-emerald-500/30 text-white p-6 rounded-2xl shadow-2xl'>
                <DialogHeader>
                    <DialogTitle className='flex gap-2 items-center text-lg font-bold text-white'>
                        <Settings2 className='w-5 h-5 text-emerald-400' />
                        Project/Repo Settings
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                        Configure project-level defaults used during script generation and execution.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 my-2 text-left">
                    <div>
                        <label className='text-xs font-mono font-semibold text-slate-300 block mb-1'>APP URL / DEFAULT WEBSITE</label>
                        <Input 
                            value={repoSettings?.targetDomain}
                            onChange={(e) => setRepoSettings({ ...repoSettings, targetDomain: e.target.value })}
                            placeholder='https://myapp.com or http://localhost:3000' 
                            className='bg-black/50 border-white/10 text-xs text-slate-200 placeholder:text-slate-500 h-9 rounded-lg focus-visible:ring-emerald-500 font-mono' 
                        />
                        <p className='text-[11px] text-slate-400 mt-1'>The target address where automated headless browsers will connect and run test cases.</p>
                    </div>
                    <div>
                        <label className='text-xs font-mono font-semibold text-slate-300 block mb-1'>GLOBAL TEST INSTRUCTIONS</label>
                        <Textarea 
                            value={repoSettings?.globalInstruction}
                            onChange={(e) => setRepoSettings({ ...repoSettings, globalInstruction: e.target.value })} 
                            placeholder='Include any authentication credentials, cookies, setup, or teardown instructions.' 
                            rows={4}
                            className='bg-black/50 border-white/10 text-xs text-slate-200 placeholder:text-slate-500 rounded-lg focus-visible:ring-emerald-500' 
                        />
                        <p className='text-[11px] text-slate-400 mt-1'>Include any authentication credentials, cookies, setup, or teardown instructions. These are automatically appended to Gemini's prompts.</p>
                    </div>
                </div>
                <DialogFooter className="flex items-center justify-end gap-2.5 pt-2">
                    <DialogClose>
                        <Button 
                            variant='outline'
                            className="h-8 px-3.5 text-xs text-slate-400 hover:text-white bg-transparent hover:bg-white/5 border-white/10 rounded-lg"
                        >
                            Close
                        </Button>
                    </DialogClose>
                    <Button 
                        onClick={handleSaveSettings}
                        className="h-8 px-4 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                        Save Config
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RepoSettings