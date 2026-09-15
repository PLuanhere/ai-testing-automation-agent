"use client";
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React, { useContext } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext'
import { Coins } from 'lucide-react'

function WorkspaceHeader() {
    const { userDetail } = useContext(UserDetailContext);
    return (
        <div className='flex w-full justify-between p-4 items-center shadow-sm bg-white'>
            {/* Logo */}
            <Image src={'/logo.svg'} alt='Logo' width={100} height={100} />
            {/* Menu Option */}
            <ul className='flex gap-8 text-xl font-medium'>
                <li className='hover:text-blue-500 cursor-pointer'>Workspace</li>
                <li className='hover:text-blue-500 cursor-pointer'>Pricing</li>
                <li className='hover:text-blue-500 cursor-pointer'>Support</li>
            </ul>

            {/* User Button */}
            <div className='flex items-center gap-4'>
                {userDetail && (
                    <div className='flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100'>
                        <Coins className='w-4 h-4 text-blue-500' />
                        {userDetail.credit} Credits
                    </div>
                )}
                <UserButton />
            </div>
        </div>
    )
}

export default WorkspaceHeader