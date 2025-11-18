"use server";

import { projectTemplate } from "@/server/db/schema";
import {
  createProjectTemplateSchema,
  TCreateProjectTemplateSchema,
} from "../schemas";
import { db } from "@/server/connection";

export type Response = {
  success: boolean;
  message: string;
};

export async function createTemplate(
  props: TCreateProjectTemplateSchema
): Promise<Response> {
  const validatedData = createProjectTemplateSchema.parse(props);

  if (!validatedData) {
    return { success: false, message: "Invalid data" };
  }

  console.log("Validated data:", validatedData);

  try {
    const [newTemplate] = await db
      .insert(projectTemplate)
      .values({
        name: validatedData.name,
        description: validatedData.description ?? null,
        defaultPrice: validatedData.defaultPrice,
        defaultCurrency: validatedData.defaultCurrency,
        defaultPaymentType: validatedData.defaultPaymentType,
        defaultTermsAndConditions:
          validatedData.defaultTermsAndConditions ?? null,
      })
      .returning();

    return { success: true, message: "Template created successfully" };
  } catch (error) {
    console.error("Database error:", error);

    // Extract more detailed error information
    let errorMessage = "Failed to create template";
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
      } else if (actualError.code === "23502") {
        // Not null violation
        errorMessage = "Required fields are missing";
      } else if (actualError.code === "missing_connection_string") {
        errorMessage =
          "Database connection is not configured. Please set POSTGRES_URL environment variable.";
      } else if (actualError.detail) {
        errorMessage = actualError.detail;
      }
    } else if (actualError && typeof actualError === "object") {
      const err = actualError as {
        message?: string;
        code?: string;
        detail?: string;
      };
      if (err.message) {
        errorMessage = err.message;
      } else if (err.code === "23505") {
        errorMessage = "A template with this name already exists";
      } else if (err.code === "23502") {
        errorMessage = "Required fields are missing";
      } else if (err.code === "missing_connection_string") {
        errorMessage =
          "Database connection is not configured. Please set POSTGRES_URL environment variable.";
      } else if (err.detail) {
        errorMessage = err.detail;
      }
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
