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
import { SettingsIcon } from 'lucide-react'
import { Input } from '../ui/input'
import { Textarea } from "../ui/textarea"
import { TestCase } from './UserRepoList'
import axios from 'axios'

type props = {
    testCase?: TestCase
    setReload: any;
}

function TestCaseSettingDialog({ testCase, setReload }: props) {

    const [isOpen, setIsOpen] = useState(false);
    const [formTestCase, setFormTestCase] = useState({
        title: testCase?.title || '',
        description: testCase?.description || '',
        targetRoute: testCase?.targetRoute || '',
        expectedResult: testCase?.expectedResult || '',
    });

    const handleInputChange = (fieldName: string, value: string) => {
        setFormTestCase((prev) => ({
            ...prev,
            [fieldName]: value
        }))
    }

    const updateCase = async () => {
        const result = await axios.post('/api/test-cases/settings', {
            ...formTestCase,
            testCaseId: testCase?.id
        });
        console.log(result?.data);
        setIsOpen(false);
        setReload();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <Button
                    size={'icon'}
                    variant={'ghost'}
                    className='h-7 w-7 rounded-lg bg-black/40 border border-white/10 text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/40 hover:border-emerald-500/40 transition-all duration-200 shrink-0'
                    title="Edit Testing Requirements"
                >
                    <SettingsIcon className='h-3.5 w-3.5' />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-2xl bg-[#0b120e] border border-emerald-500/30 text-white p-6 rounded-2xl shadow-2xl'>
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <SettingsIcon className="w-4 h-4 text-emerald-400" />
                        Edit Testing Requirements
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                        Modifying these parameters automatically clears pre-generated scripts to ensure synchronization.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-2 text-left">
                    <div>
                        <label className='text-xs font-mono font-semibold text-slate-300 block mb-1'>TEST TITLE</label>
                        <Input
                            value={formTestCase?.title}
                            onChange={(event) => handleInputChange('title', event?.target?.value)}
                            placeholder='Test Title'
                            className='bg-black/50 border-white/10 text-xs text-slate-200 placeholder:text-slate-500 h-9 rounded-lg focus-visible:ring-emerald-500'
                        />
                    </div>
                    <div>
                        <label className='text-xs font-mono font-semibold text-slate-300 block mb-1'>DESCRIPTION / ACTION</label>
                        <Textarea
                            value={formTestCase?.description}
                            onChange={(event) => handleInputChange('description', event?.target?.value)}
                            placeholder='Description'
                            rows={3}
                            className='bg-black/50 border-white/10 text-xs text-slate-200 placeholder:text-slate-500 rounded-lg focus-visible:ring-emerald-500'
                        />
                    </div>
                    <div>
                        <label className='text-xs font-mono font-semibold text-slate-300 block mb-1'>TARGET ROUTE / PATH</label>
                        <Input
                            value={formTestCase?.targetRoute}
                            onChange={(event) => handleInputChange('targetRoute', event?.target?.value)}
                            placeholder='Target Route (e.g. /login)'
                            className='bg-black/50 border-white/10 text-xs text-slate-200 placeholder:text-slate-500 h-9 rounded-lg focus-visible:ring-emerald-500 font-mono'
                        />
                    </div>
                    <div>
                        <label className='text-xs font-mono font-semibold text-slate-300 block mb-1'>EXPECTED RESULT</label>
                        <Textarea
                            value={formTestCase?.expectedResult}
                            onChange={(event) => handleInputChange('expectedResult', event?.target?.value)}
                            placeholder='Expected Result'
                            rows={3}
                            className='bg-black/50 border-white/10 text-xs text-slate-200 placeholder:text-slate-500 rounded-lg focus-visible:ring-emerald-500'
                        />
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-end gap-3 pt-4 mt-2">
                    <DialogClose>
                        <Button
                            variant='outline'
                            className="h-8 px-4 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/15 rounded-xl transition-all"
                        >
                            Close
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={updateCase}
                        className="h-8 px-5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                    >
                        Update Case
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TestCaseSettingDialog