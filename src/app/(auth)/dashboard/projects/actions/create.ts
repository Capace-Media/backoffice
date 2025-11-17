"use server";

import { projectTemplate } from "@/server/db/schema";
import {
  createProjectTemplateSchema,
  CreateProjectTemplateSchema,
} from "../components/form";
import { db } from "@/server/connection";

export type Response = {
  success: boolean;
  message: string;
};

export async function createTemplate(
  props: CreateProjectTemplateSchema
): Promise<Response> {
  const validatedData = createProjectTemplateSchema.parse(props);

  if (!validatedData) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const [newTemplate] = await db
      .insert(projectTemplate)
      .values(validatedData)
      .returning();

    return { success: true, message: "Template created successfully" };
  } catch (error) {
    return { success: false, message: "Failed to create template: " + error };
  }
}
