import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WorkspaceHeader() {
    return (
        <div className='flex justify-between w-full p-4 items-center'>
            {/* Logo */}
            <Image src={'/logo.svg'} alt='Logo' width={100} height={100} />
            {/* Menu Option */}
            <ul className='flex gap-5 text-xl'>
                <li className='hover:text-blue-500 cursor-pointer'>Workspace</li>
                <li className='hover:text-blue-500 cursor-pointer'>Pricing</li>
                <li className='hover:text-blue-500 cursor-pointer'>Support</li>
            </ul>

            {/* User Button */}
            <UserButton />
        </div>
    )
}

export default WorkspaceHeader