"use server";

import { projectTemplate } from "@/server/db/schema";
import {
  createProjectTemplateSchema,
  CreateProjectTemplateSchema,
} from "../schemas";
import { db } from "@/server/connection";
import { eq } from "drizzle-orm";

export type Response = {
  success: boolean;
  message: string;
};

export async function editTemplate(
  props: CreateProjectTemplateSchema,
  slug: string
): Promise<Response> {
  const validatedData = createProjectTemplateSchema.parse(props);

  if (!validatedData) {
    return { success: false, message: "Invalid data" };
  }

  console.log("Validated data:", validatedData);

  try {
    await db
      .update(projectTemplate)
      .set(validatedData)
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
