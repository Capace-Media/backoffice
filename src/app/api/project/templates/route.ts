import { db } from "@/server/connection";
import { projectTemplate } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { count, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get("limit") || "10", 10))
    );
    const offset = (page - 1) * limit;

    const [totalResult] = await db
      .select({ count: count() })
      .from(projectTemplate);
    const total = totalResult?.count || 0;

    const templates = await db
      .select()
      .from(projectTemplate)
      .orderBy(desc(projectTemplate.createdAt))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: templates,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
