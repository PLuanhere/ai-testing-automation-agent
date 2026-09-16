import WorkspaceBody from '@/components/custom/WorkspaceBody';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

export default async function Workspace() {
  await auth.protect();
  return (
    <div className="w-full">
      <WorkspaceBody />
    </div>
  );
}