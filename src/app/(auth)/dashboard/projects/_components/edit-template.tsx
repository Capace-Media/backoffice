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
  FieldContent,
} from "@/components/ui/field";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { currencyOptions, paymentTypeOptions } from "../schemas";
import { editTemplate } from "../actions/edit";
import useAppForm from "@/components/form/useAppForm";
import {
  editTemplateSchema,
  TeditTemplateSchema,
} from "@/lib/zod-schemas/template";
import { FormValidateOrFn } from "@tanstack/react-form";

type Props = {
  slug: string;
};

export default function EditTemplate(props: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["template", props.slug],
    queryFn: async () => {
      const response = await fetch(`/api/project/template?slug=${props.slug}`);
      const result = await response.json();
      return result;
    },
  });

  if (!data?.data) {
    return <div>No data</div>;
  }
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  const template = data.data;
  return <EditTemplateForm slug={props.slug} template={template} />;
}

function EditTemplateForm(props: { slug: string; template: any }) {
  const queryClient = useQueryClient();
  const form = useAppForm({
    defaultValues: {
      name: props.template.name ?? "",
      description: props.template.description ?? "",
      defaultPrice: props.template.defaultPrice ?? 0,
      defaultCurrency: props.template.defaultCurrency ?? "SEK",
      defaultPaymentType: props.template.defaultPaymentType ?? "one-time",
      defaultTermsAndConditions: props.template.defaultTermsAndConditions ?? "",
      active: props.template.active ?? true,
    } as TeditTemplateSchema,
    validators: {
      onChange: editTemplateSchema as FormValidateOrFn<TeditTemplateSchema>,
    },

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

  // Handle loading and error states after hooks

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
                  <Field orientation="horizontal">
                    <form.AppField name="active">
                      {(field) => <field.Checkbox />}
                    </form.AppField>
                    <FieldContent>
                      <FieldLabel htmlFor="active">Active</FieldLabel>
                      <FieldDescription>
                        Whether the template is active or not.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
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
