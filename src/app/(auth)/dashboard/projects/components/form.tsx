"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useAppForm from "@/components/form/useAppForm";
import { createTemplate } from "../actions/create";
import { useRouter } from "next/navigation";
import {
  createProjectTemplateSchema,
  CreateProjectTemplateSchema,
  currencyOptions,
  paymentTypeOptions,
} from "../schemas";
export default function CreateProjectTemplate() {
  const router = useRouter();
  const defaultValues = {
    name: "",
    description: "",
    defaultPrice: 0,
    defaultCurrency: "SEK",
    defaultPaymentType: "one-time",
    defaultTermsAndConditions: "",
  } as CreateProjectTemplateSchema;
  const form = useAppForm({
    validators: {
      onChange: createProjectTemplateSchema as any,
    },
    defaultValues,
    onSubmit: async (values) => {
      console.log(values);
      const result = await createTemplate(values.value);
      if (result.success) {
        router.push("/dashboard/projects");
      } else {
        console.error(result.message);
      }
    },
  });
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.AppField name="name">
              {(field) => <field.Input label="Name" />}
            </form.AppField>
            <form.AppField name="description">
              {(field) => <field.Textarea label="Description" />}
            </form.AppField>
            <form.AppField name="defaultPrice">
              {(field) => <field.Input label="Default Price" type="number" />}
            </form.AppField>
            <form.AppField name="defaultCurrency">
              {(field) => (
                <field.Select
                  label="Default Currency"
                  options={currencyOptions}
                />
              )}
            </form.AppField>
            <form.AppField name="defaultPaymentType">
              {(field) => (
                <field.Select
                  label="Default Payment Type"
                  options={paymentTypeOptions}
                />
              )}
            </form.AppField>
            <form.AppField name="defaultTermsAndConditions">
              {(field) => (
                <field.Textarea label="Default Terms And Conditions" />
              )}
            </form.AppField>
            <form.AppForm>
              <form.Submit className="w-full">
                {" "}
                {form.state.isSubmitting
                  ? "Creating project template..."
                  : "Create Project Template"}
              </form.Submit>
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
