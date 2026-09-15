import React, { useState } from 'react'
import { TestCase } from './UserRepoList'
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Play, RefreshCw, SettingsIcon } from 'lucide-react';
import { Button } from '../ui/button';
import TestCaseSettingDialog from './TestCaseSettingDialog';
import axios from 'axios';
import TestExecutionModal from './TestCaseExecutionModel';

type Props = {
    testCase: TestCase[],
    onReload: any,
    repository: any
}

function TestCaseList({ testCase, onReload, repository }: Props) {

    const [selectedTestCases, setSelectedTestCases] = useState<TestCase[]>([]);
    const [isModelOpen, setIsModelOpen] = useState(false);;

    const handleSelectedTestCase = (checked: boolean | string, testCase: TestCase) => {
        if (checked) {
            setSelectedTestCases((prev: any) => [...prev, testCase]);
        } else {
            setSelectedTestCases((prev: any) => prev.filter((item: any) => item.id != testCase.id));
        }
    }

    return (
        <div >
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-primary'>Generated Test Cases</h2>
                <Button className='py-4' size={'sm'} onClick={() => onReload(testCase[0]?.repoId)}><RefreshCw className='h-3 w-3 mr-2' />Refresh </Button>
            </div>
            <div className='border rounded-md mt-4'>
                {testCase.map((testCase, index) => (
                    <div key={index} className='p-4 border-b flex items-center justify-between'>
                        <div className='flex gap-3 items-center'>
                            <Checkbox
                                checked={selectedTestCases?.some((item: any) => item.id == testCase?.id)}
                                onCheckedChange={(checked) => handleSelectedTestCase(checked, testCase)} />
                            <div>
                                <h2>{testCase?.title}</h2>
                                <p className='text-xs text-gray-500'>{testCase?.description}</p>
                            </div>
                        </div>
                        <div className='gap-4 flex items-center'>
                            <Badge variant={'secondary'}>{testCase?.type}</Badge>
                            {testCase?.status == 'failed' && <Badge variant={'destructive'} className='text-red-200 font-normal'>{testCase?.status}</Badge>}
                            {testCase?.status == 'passed' && <Badge variant={'default'} className='text-green-200 font-normal'>{testCase?.status}</Badge>}
                            {testCase?.status == 'running' && <Badge variant={'default'} className='text-yellow-200 font-normal'>{testCase?.status}</Badge>}
                            <TestCaseSettingDialog testCase={testCase} setReload={onReload} />
                        </div>
                    </div>
                ))}

                <div className='p-4 flex items-center justify-between bg-gray-200'>
                    <h2 className='font-semibold'>Run Selected Test Case</h2>
                    <Button className='py-4' disabled={selectedTestCases?.length == 0} onClick={() => setIsModelOpen(true)}>
                        <Play className='h-4 w-4 mr-2' />Run Test Cases
                    </Button>
                </div>
            </div>
            <TestExecutionModal
                testCases={selectedTestCases}
                repository={repository}
                isOpen={isModelOpen}
                onClose={() => { setIsModelOpen(false); onReload(repository?.repoId) }}
            />
        </div>
    )
}

export default TestCaseList