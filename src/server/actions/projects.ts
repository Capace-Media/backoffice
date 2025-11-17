"use server";

import { db } from "@/server/connection";
import { projectTemplate, projects } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createProjectTemplate(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const defaultPrice = formData.get("defaultPrice")
    ? parseInt(formData.get("defaultPrice") as string)
    : 0;
  const defaultCurrency = (formData.get("defaultCurrency") as string) || "SEK";
  const defaultTermsAndConditions = formData.get(
    "defaultTermsAndConditions"
  ) as string | null;

  if (!name) {
    return { error: "Template name is required" };
  }

  try {
    const [newTemplate] = await db
      .insert(projectTemplate)
      .values({
        name,
        description: description || null,
        defaultPrice,
        defaultCurrency,
        defaultTermsAndConditions: defaultTermsAndConditions || null,
      })
      .returning();

    revalidatePath("/dashboard/projects");
    return { success: true, data: newTemplate };
  } catch (error) {
    console.error("Error creating project template:", error);
    return { error: "Failed to create project template" };
  }
}

export async function createProject(formData: FormData) {
  const templateId = formData.get("templateId")
    ? parseInt(formData.get("templateId") as string)
    : null;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const customerId = formData.get("customerId")
    ? parseInt(formData.get("customerId") as string)
    : null;
  const price = formData.get("price")
    ? parseInt(formData.get("price") as string)
    : 0;
  const currency = (formData.get("currency") as string) || "SEK";
  const termsAndConditions = formData.get("termsAndConditions") as
    | string
    | null;

  if (!name) {
    return { error: "Project name is required" };
  }

  try {
    // If templateId is provided, get default values from template
    let defaultValues = {
      price: 0,
      currency: "SEK",
      termsAndConditions: null as string | null,
    };

    if (templateId) {
      const [template] = await db
        .select()
        .from(projectTemplate)
        .where(eq(projectTemplate.id, templateId))
        .limit(1);

      if (template) {
        defaultValues = {
          price: template.defaultPrice || 0,
          currency: template.defaultCurrency || "SEK",
          termsAndConditions: template.defaultTermsAndConditions,
        };
      }
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        templateId: templateId,
        name,
        description: description || null,
        customerId: customerId,
        price: price || defaultValues.price,
        currency: currency || defaultValues.currency,
        termsAndConditions:
          termsAndConditions || defaultValues.termsAndConditions,
        status: "draft",
      })
      .returning();

    revalidatePath("/dashboard/projects");
    return { success: true, data: newProject };
  } catch (error) {
    console.error("Error creating project:", error);
    return { error: "Failed to create project" };
  }
}

export async function getProjectTemplates() {
  try {
    const templates = await db.select().from(projectTemplate);
    return { success: true, data: templates };
  } catch (error) {
    console.error("Error fetching project templates:", error);
    return { error: "Failed to fetch project templates", data: [] };
  }
}
