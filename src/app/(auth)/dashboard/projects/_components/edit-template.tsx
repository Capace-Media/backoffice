"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldSet,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldLegend,
  FieldSeparator,
} from "@/components/ui/field";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  TCreateProjectTemplateSchema,
  createProjectTemplateSchema,
  currencyOptions,
  paymentTypeOptions,
} from "../schemas";
import { editTemplate } from "../actions/edit";
import useAppForm from "@/components/form/useAppForm";

type Props = {
  slug: string;
};

export default function EditTemplate(props: Props) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["template", props.slug],
    queryFn: async () => {
      const response = await fetch(`/api/project/template?slug=${props.slug}`);
      const result = await response.json();
      return result;
    },
  });

  const defaultValues: TCreateProjectTemplateSchema = {
    name: "",
    description: "",
    defaultPrice: 0,
    defaultCurrency: "SEK",
    defaultPaymentType: "one-time",
    defaultTermsAndConditions: "",
  };

  const form = useAppForm({
    validators: {
      onChange: createProjectTemplateSchema as any,
    },
    defaultValues,
    onSubmit: async (values) => {
      console.log(values);
      const result = await editTemplate(values.value, props.slug);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["template", props.slug] });
        queryClient.invalidateQueries({ queryKey: ["templates"] });
      } else {
        console.error(result.message);
      }
    },
  });

  // Update form values when data loads
  useEffect(() => {
    if (data?.data) {
      const template = data.data;
      form.reset({
        name: template.name || "",
        description: template.description || "",
        defaultPrice: template.defaultPrice || 0,
        defaultCurrency: template.defaultCurrency || "SEK",
        defaultPaymentType: template.defaultPaymentType || "one-time",
        defaultTermsAndConditions: template.defaultTermsAndConditions || "",
      });
    }
  }, [data, form]);

  // Handle loading and error states after hooks
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Project Template</CardTitle>
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
                          ? "Updating project template..."
                          : "Update Project Template"}
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
