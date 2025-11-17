"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useAppForm from "@/components/form/useAppForm";
import { z } from "zod";

export const createProjectTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  defaultPrice: z.number().min(0),
  defaultCurrency: z.enum(["SEK", "USD", "EUR", "GBP", "DKK", "NOK", "CHF"]),
  defaultPaymentType: z.enum(["one-time", "monthly", "yearly"]),
  defaultTermsAndConditions: z.string().optional(),
});

export const currencyOptions = [
  { value: "SEK", label: "SEK" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "DKK", label: "DKK" },
  { value: "NOK", label: "NOK" },
  { value: "CHF", label: "CHF" },
];
export const paymentTypeOptions = [
  { value: "one-time", label: "One-time Payment" },
  { value: "monthly", label: "Monthly Subscription" },
  { value: "yearly", label: "Yearly Subscription" },
];
export type CreateProjectTemplateSchema = z.infer<
  typeof createProjectTemplateSchema
>;
export default function CreateProjectTemplate() {
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
      onChange: createProjectTemplateSchema,
    },
    defaultValues,
    onSubmit: async (values) => {
      console.log(values);
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
              {(field) => <field.Input label="Default Price" />}
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
