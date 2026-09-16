import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");
    
    // In local dev, always use the current local host/port callback
    const redirectUri = isLocal
        ? `${origin}/api/github/callback`
        : (process.env.GITHUB_REDIRECT_URL || `${origin}/api/github/callback`);

    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: redirectUri,
        scope: 'repo read:user'
    });

    redirect(`https://github.com/login/oauth/authorize?${params}`);
}