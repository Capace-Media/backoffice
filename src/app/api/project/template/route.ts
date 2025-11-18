import { db } from "@/server/connection";
import { projectTemplate } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }
  const template = await getTemplate(slug);
  return NextResponse.json(template);
}

async function getTemplate(slug: string) {
  const template = await db
    .select()
    .from(projectTemplate)
    .where(eq(projectTemplate.id, parseInt(slug, 10)))
    .limit(1);
  if (!template) {
    return { error: "Template not found" };
  }
  return {
    success: true,
    data: template[0],
  };
}
