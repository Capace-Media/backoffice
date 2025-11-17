import { createProjectTemplate } from "@/server/actions/projects";
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
import { redirect } from "next/navigation";

export default function CreateProjectTemplatePage() {
  async function handleSubmit(formData: FormData) {
    "use server";

    const result = await createProjectTemplate(formData);

    if (result.success) {
      redirect("/dashboard/projects");
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
          <CardTitle>Create Project Template</CardTitle>
          <CardDescription>
            Create a reusable project template (e.g., SEO, Website, ADS)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., SEO, Website, ADS"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Template description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultPrice">Default Price</Label>
                <Input
                  id="defaultPrice"
                  name="defaultPrice"
                  type="number"
                  placeholder="0"
                  defaultValue={0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Input
                  id="defaultCurrency"
                  name="defaultCurrency"
                  placeholder="SEK"
                  defaultValue="SEK"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultTermsAndConditions">
                Default Terms and Conditions
              </Label>
              <Textarea
                id="defaultTermsAndConditions"
                name="defaultTermsAndConditions"
                placeholder="Default terms and conditions..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Create Template</Button>
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
