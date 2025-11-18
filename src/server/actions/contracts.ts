"use server";

import { db } from "@/server/connection";
import {
  contract,
  contractToProject,
  projects,
  projectTemplate,
} from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createContract(formData: FormData) {
  const contractText = formData.get("contract") as string;
  const customerId = formData.get("customerId")
    ? parseInt(formData.get("customerId") as string)
    : null;

  if (!contractText) {
    return { error: "Contract text is required" };
  }

  try {
    const [newContract] = await db
      .insert(contract)
      .values({
        contract: contractText,
        customerId: customerId,
      })
      .returning();

    revalidatePath("/dashboard/contracts");
    return { success: true, data: newContract };
  } catch (error) {
    console.error("Error creating contract:", error);
    return { error: "Failed to create contract" };
  }
}

export async function addProjectsToContract(
  contractId: number,
  projectTemplateIds: number[]
) {
  if (!contractId || !projectTemplateIds.length) {
    return { error: "Contract ID and project template IDs are required" };
  }

  try {
    // For each template, create a project instance and link it to the contract
    const projectInstances = await Promise.all(
      projectTemplateIds.map(async (templateId) => {
        const template = await db
          .select()
          .from(projectTemplate)
          .where(eq(projectTemplate.id, templateId))
          .limit(1);

        if (template.length === 0) {
          throw new Error(`Template ${templateId} not found`);
        }

        const [project] = await db
          .insert(projects)
          .values({
            templateId: templateId,
            name: template[0].name,
            description: template[0].description,
            price: template[0].defaultPrice || 0,
            currency: template[0].defaultCurrency || "SEK",
            termsAndConditions: template[0].defaultTermsAndConditions,
            status: "draft",
          })
          .returning();

        // Link project to contract
        await db.insert(contractToProject).values({
          contractId: contractId,
          projectId: project.id,
        });

        return project;
      })
    );

    revalidatePath("/dashboard/contracts");
    return { success: true, data: projectInstances };
  } catch (error) {
    console.error("Error adding projects to contract:", error);
    return { error: "Failed to add projects to contract" };
  }
}

export async function createContractWithProjects(
  contractText: string,
  customerId: number | null,
  projectTemplateIds: number[]
) {
  try {
    // Create the contract
    const formData = new FormData();
    formData.append("contract", contractText);
    if (customerId) {
      formData.append("customerId", customerId.toString());
    }
    const contractResult = await createContract(formData);

    if (contractResult.error || !contractResult.data) {
      return contractResult;
    }

    // Add projects if any
    if (projectTemplateIds.length > 0) {
      const projectsResult = await addProjectsToContract(
        contractResult.data.id,
        projectTemplateIds
      );

      if (projectsResult.error) {
        return projectsResult;
      }
    }

    return { success: true, data: contractResult.data };
  } catch (error) {
    console.error("Error creating contract with projects:", error);
    return { error: "Failed to create contract with projects" };
  }
}
