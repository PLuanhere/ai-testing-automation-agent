"use client";
import React, { useContext } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext';
import Image from 'next/image';
import { Button } from '../button';
import { Card, CardContent } from '../card';
import EmptyWorkspace from './EmptyWorkspace';

function WorkspaceBody() {

    const { userDetail } = useContext(UserDetailContext);

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='text-4xl font-medium'>Workspce</h2>
                <h2 className='text-blue-800 bg-blue-200 px-2 rounded-lg p-1'>Remaining Credits: {userDetail?.credit}</h2>
            </div>
            <Card className='flex mt-5 justify-between items-center p-4 border rounded-lg'>
                <div className='flex gap-5 items-center'>
                    <Image src={'/github.png'} alt='github' width={40} height={40} />
                    <h2 className='text-lg'>Connect Github & Repo</h2>
                </div>
                <div>
                    <Button>Install</Button>
                </div>
            </Card>
            <Card className='mt-10'>
                <CardContent className='flex w-full items-center justify-center'>
                    <EmptyWorkspace />
                </CardContent>
            </Card>
        </div>
    )
}

export default WorkspaceBody