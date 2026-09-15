import { db, TestCasesTable } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
    const { title, description, targetRoute, expectedResult, testCaseId } = await req.json();
    const result = await db.update(TestCasesTable).set({
        title,
        description,
        targetRoute,
        expectedResult
    }).where(eq(TestCasesTable.id, testCaseId)).returning();

    return NextResponse.json(result[0]);
}