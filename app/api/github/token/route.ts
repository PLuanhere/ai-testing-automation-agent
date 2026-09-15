import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies()
    const connected = Boolean(cookieStore.get('gh_token')?.value)

    return NextResponse.json({ connected });
}
