import WorkspaceBody from '@/components/ui/custom/WorkspaceBody'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

async function Workspace() {
    await auth.protect()
    return (
        <div className='max-w-6xl mx-auto'>
            <WorkspaceBody />
        </div>
    )
}

export default Workspace