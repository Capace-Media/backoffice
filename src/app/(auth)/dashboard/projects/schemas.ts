import { z } from "zod";

export const createProjectTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  defaultPrice: z.coerce.number().int().min(0),
  defaultCurrency: z.enum(["SEK", "USD", "EUR", "GBP", "DKK", "NOK", "CHF"]),
  defaultPaymentType: z.enum(["one-time", "monthly", "yearly"]),
  defaultTermsAndConditions: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export type TCreateProjectTemplateSchema = z.infer<
  typeof createProjectTemplateSchema
>;

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
