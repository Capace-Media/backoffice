import { createProject, getProjectTemplates } from "@/server/actions/projects";
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
import { ProjectTemplateSelect } from "@/components/project-template-select";
import { redirect } from "next/navigation";

export default async function CreateProjectPage() {
  const templatesResult = await getProjectTemplates();
  const templates = templatesResult.data || [];

  async function handleSubmit(formData: FormData) {
    "use server";

    const result = await createProject(formData);

    if (result.success) {
      redirect("/dashboard/projects");
    } else {
      // In a real app, you'd want to show this error to the user
      console.error(result.error);
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Create a new project, optionally based on a template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {templates.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="templateId">Project Template (Optional)</Label>
                <ProjectTemplateSelect templates={templates} />
                <p className="text-sm text-muted-foreground">
                  Selecting a template will pre-fill default values
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., SEO Optimization, Website Redesign"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Project description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0"
                  defaultValue={0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  name="currency"
                  placeholder="SEK"
                  defaultValue="SEK"
                />
              </div>
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

            <div className="space-y-2">
              <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
              <Textarea
                id="termsAndConditions"
                name="termsAndConditions"
                placeholder="Terms and conditions..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Create Project</Button>
              <Button type="button" variant="outline" asChild>
                <a href="/dashboard/projects">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
