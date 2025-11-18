"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import useAppForm from "@/components/form/useAppForm";
import { createTemplate } from "../actions/create";
import { useRouter } from "next/navigation";
import {
  createProjectTemplateSchema,
  TCreateProjectTemplateSchema,
  currencyOptions,
  paymentTypeOptions,
} from "../schemas";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
export default function CreateProjectTemplate() {
  const router = useRouter();
  const defaultValues = {
    name: "",
    description: "",
    defaultPrice: 0,
    defaultCurrency: "SEK",
    defaultPaymentType: "one-time",
    defaultTermsAndConditions: "",
  } as TCreateProjectTemplateSchema;
  const form = useAppForm({
    validators: {
      onChange: createProjectTemplateSchema as any,
    },
    defaultValues,
    onSubmit: async (values) => {
      console.log(values);
      const result = await createTemplate(values.value);
      if (result.success) {
        // router.push("/dashboard/projects");
        form.reset();
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
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Project Template</FieldLegend>
                <FieldDescription>
                  This appears on invoices and emails.
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <form.AppField name="name">
                      {(field) => <field.Input />}
                    </form.AppField>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <form.AppField name="description">
                      {(field) => <field.Textarea />}
                    </form.AppField>
                  </Field>
                  <div className="grid grid-cols-3 gap-4">
                    <Field>
                      <FieldLabel htmlFor="defaultPrice">
                        Default Price
                      </FieldLabel>
                      <form.AppField name="defaultPrice">
                        {(field) => <field.Input type="number" />}
                      </form.AppField>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="defaultCurrency">
                        Default Currency
                      </FieldLabel>
                      <form.AppField name="defaultCurrency">
                        {(field) => <field.Select options={currencyOptions} />}
                      </form.AppField>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="defaultPaymentType">
                        Default Payment Type
                      </FieldLabel>
                      <form.AppField name="defaultPaymentType">
                        {(field) => (
                          <field.Select options={paymentTypeOptions} />
                        )}
                      </form.AppField>
                    </Field>
                  </div>
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <FieldSet>
                <FieldLegend>Default Terms And Conditions</FieldLegend>
                <FieldDescription>
                  This appears on invoices and emails.
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="defaultTermsAndConditions">
                      Default Terms And Conditions
                    </FieldLabel>
                    <form.AppField name="defaultTermsAndConditions">
                      {(field) => <field.Textarea />}
                    </form.AppField>
                  </Field>
                  <Field>
                    <form.AppForm>
                      <form.Submit className="w-full">
                        {" "}
                        {form.state.isSubmitting
                          ? "Creating project template..."
                          : "Create Project Template"}
                      </form.Submit>
                    </form.AppForm>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
