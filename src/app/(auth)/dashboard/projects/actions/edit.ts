"use server";

import { projectTemplate } from "@/server/db/schema";

import { db } from "@/server/connection";
import { eq } from "drizzle-orm";
import {
  editTemplateSchema,
  TeditTemplateSchema,
} from "@/lib/zod-schemas/template";

export type Response = {
  success: boolean;
  message: string;
};

export async function editTemplate(
  props: TeditTemplateSchema,
  slug: string
): Promise<Response> {
  const validatedData = editTemplateSchema.safeParse(props);

  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  console.log("Validated data:", validatedData.data);

  try {
    await db
      .update(projectTemplate)
      .set(validatedData.data)
      .where(eq(projectTemplate.id, parseInt(slug, 10)));

    return { success: true, message: "Template updated successfully" };
  } catch (error) {
    console.error("Database error:", error);

    // Extract more detailed error information
    let errorMessage = "Failed to update template";
    const errorObj = error as any;

    // Check for nested cause (common in Drizzle/Vercel Postgres errors)
    const actualError = (errorObj.cause || errorObj) as Error & {
      code?: string;
      detail?: string;
    };

    if (actualError instanceof Error) {
      errorMessage = actualError.message;

      // Check for PostgreSQL-specific error details
      if (actualError.code === "23505") {
        // Unique violation
        errorMessage = "A template with this name already exists";
      }
    } else if (actualError && typeof actualError === "object") {
      const err = actualError as {
        message?: string;
        code?: string;
        detail?: string;
      };
      if (err.message) {
        errorMessage = err.message;
      }
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
