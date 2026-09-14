import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'lucide-react'

function EmptyWorkspace() {
    return (
        <div className='flex flex-col mt-10 items-center justify-center'>
            <Image src={'/folder.png'} alt='folder' width={70} height={70} />
            <h2 className='text-2xl font-medium mt-2'>No Repository Connected</h2>
            <p className='text-center mx-10 text-lg'>Connect your Github accounts and add a repository to generate and run test case</p>

            <Button className='mt-5'>
                <Link className='h-4 w-4 mr-2' />
                Connect Repo
            </Button>
        </div>
    )
}

export default EmptyWorkspace