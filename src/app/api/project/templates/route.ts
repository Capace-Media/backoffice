import { db } from "@/server/connection";
import { projectTemplate } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { count, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(
    1,
    Math.min(100, parseInt(searchParams.get("limit") || "10", 10))
  );
  const offset = (page - 1) * limit;

  const result = await getTemplates(page, limit, offset);
  return NextResponse.json(result);
}

async function getTemplates(
  page: number,
  limit: number,
  offset: number
): Promise<{
  success: boolean;
  data?: any[] | undefined;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> {
  const [totalResult] = await db
    .select({ count: count() })
    .from(projectTemplate);
  const total = totalResult?.count || 0;

  if (total === 0) {
    return {
      success: false,
      message: "No templates found",
      data: [],
      pagination: {
        page,
        limit,
        total,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  const templates = await db
    .select()
    .from(projectTemplate)
    .orderBy(desc(projectTemplate.createdAt))
    .limit(limit)
    .offset(offset);

  const totalPages = Math.ceil(total / limit);

  return {
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
  };
}
