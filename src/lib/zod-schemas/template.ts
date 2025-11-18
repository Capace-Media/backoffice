import { z } from "zod";

export const editTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  defaultPrice: z.coerce.number().int().min(0),
  defaultCurrency: z.enum(["SEK", "USD", "EUR", "GBP", "DKK", "NOK", "CHF"]),
  defaultPaymentType: z.enum(["one-time", "monthly", "yearly"]),
  defaultTermsAndConditions: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export type TeditTemplateSchema = z.infer<typeof editTemplateSchema>;
