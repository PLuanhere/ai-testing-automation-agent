"use client";
import React, { useContext, useEffect, useState } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import EmptyWorkspace from './EmptyWorkspace';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import RepoDialog from './RepoDialog';
import { refresh } from 'next/cache';

function WorkspaceBody() {

    const { userDetail } = useContext(UserDetailContext);
    const router = useRouter()
    const [token, setToken] = useState('');

    useEffect(() => {
        GetGithubUserToken();
    }, [])

    const GetGithubUserToken = async () => {
        const result = await axios.get('/api/github/token');
        console.log('Github token from db ', result.data.token);
        setToken(result.data.token);
    }

    const OnAddRepo = async () => {
        router.push('/api/github');
    }

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='text-4xl font-medium'>Workspace</h2>
                <h2 className='text-blue-800 bg-blue-200 px-2 rounded-lg p-1'>Remaining Credits: {userDetail?.credit}</h2>
            </div>
            <Card className='flex mt-5 justify-between items-center p-4 border rounded-lg'>
                <div className='flex gap-5 items-center'>
                    <Image src={'/github.png'} alt='github' width={40} height={40} />
                    <h2 className='text-lg'>Connect Github & Repo</h2>
                </div>
                <div>
                    {!token ? <Button onClick={OnAddRepo}>Setup</Button>
                        : <RepoDialog setRefreshPage={(refresh: boolean) => console.log(refresh)} />}
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