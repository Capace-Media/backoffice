import { createContractWithProjects } from "@/server/actions/contracts";
import { getProjectTemplates } from "@/server/actions/projects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { redirect } from "next/navigation";

export default async function CreateContractPage() {
  const templatesResult = await getProjectTemplates();
  const templates = templatesResult.data || [];

  async function handleSubmit(formData: FormData) {
    "use server";

    const contractText = formData.get("contract") as string;
    const customerId = formData.get("customerId")
      ? parseInt(formData.get("customerId") as string)
      : null;

    // Get selected template IDs
    const selectedTemplateIds: number[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("template_") && value === "on") {
        const templateId = parseInt(key.replace("template_", ""));
        selectedTemplateIds.push(templateId);
      }
    }

    const result = await createContractWithProjects(
      contractText,
      customerId,
      selectedTemplateIds
    );

    if (result.success) {
      redirect("/dashboard/contracts");
    } else {
      // In a real app, you'd want to show this error to the user
      if ("error" in result) {
        console.error(result.error);
      }
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Contract</CardTitle>
          <CardDescription>
            Create a new contract and optionally add project templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contract">Contract Text</Label>
              <Textarea
                id="contract"
                name="contract"
                placeholder="Enter contract details..."
                required
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID (Optional)</Label>
              <Input
                id="customerId"
                name="customerId"
                type="number"
                placeholder="Enter customer ID"
              />
            </div>

            {templates.length > 0 && (
              <div className="space-y-3">
                <Label>Select Project Templates</Label>
                <div className="space-y-2 border rounded-md p-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`template_${template.id}`}
                        name={`template_${template.id}`}
                      />
                      <Label
                        htmlFor={`template_${template.id}`}
                        className="font-normal cursor-pointer"
                      >
                        {template.name}
                        {template.description && (
                          <span className="text-muted-foreground text-sm ml-2">
                            - {template.description}
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {templates.length === 0 && (
              <div className="text-sm text-muted-foreground p-4 border rounded-md">
                No project templates available. Create templates first in the
                Projects section.
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit">Create Contract</Button>
              <Button type="button" variant="outline" asChild>
                <a href="/dashboard/contracts">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
