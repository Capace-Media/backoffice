import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { relations } from "drizzle-orm";

export const projectStatus = pgEnum("project_status", [
  "draft",
  "published",
  "archived",
]);

export const paymentType = pgEnum("payment_type", [
  "one-time",
  "monthly",
  "yearly",
]);

export const currency = pgEnum("currency", [
  "SEK",
  "USD",
  "EUR",
  "GBP",
  "DKK",
  "NOK",
  "CHF",
]);

export const contract = pgTable("contract", {
  id: serial("id").primaryKey(),
  contract: text("contract").notNull(),
  customerId: integer("customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectTemplate = pgTable("project_template", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // "SEO", "Website", "ADS"
  active: boolean("active").notNull().default(true),
  description: text("description"),
  defaultPrice: integer("default_price").default(0),
  defaultPaymentType: paymentType("default_payment_type").default("one-time"),
  defaultCurrency: currency("default_currency").default("SEK"),
  defaultTermsAndConditions: text("default_terms_and_conditions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => projectTemplate.id),
  name: text("name").notNull(),
  description: text("description"),
  customerId: integer("customer_id"),
  termsAndConditions: text("terms_and_conditions"),
  price: integer("price").notNull().default(0),
  paymentType: paymentType("payment_type").notNull().default("one-time"),
  currency: currency("currency").notNull().default("SEK"),
  status: projectStatus("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),
});

export const customerInformation = pgTable(
  "customer_information",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    zip: text("zip"),
    country: text("country"),
    notes: text("notes"),
    organizationNumber: text("organization_number"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("customer_information_organization_number_unique").on(
      t.organizationNumber
    ),
  ]
);

export const projectTemplateRelations = relations(
  projectTemplate,
  ({ many }) => ({
    projects: many(projects),
  })
);

export const contractToProject = pgTable(
  "contract_to_project",
  {
    contractId: integer("contract_id")
      .notNull()
      .references(() => contract.id),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id),
    // Contract-specific overrides
    contractPrice: integer("contract_price"), // Override project price for this contract
    contractTerms: text("contract_terms"), // Override terms for this contract
  },
  (t) => [primaryKey({ columns: [t.contractId, t.projectId] })]
);
export const customerRelations = relations(customerInformation, ({ many }) => ({
  projects: many(projects),
  contracts: many(contract),
}));

export const contractRelations = relations(contract, ({ many, one }) => ({
  contractToProject: many(contractToProject),
  customer: one(customerInformation, {
    fields: [contract.customerId],
    references: [customerInformation.id],
  }),
}));

export const projectRelations = relations(projects, ({ many, one }) => ({
  template: one(projectTemplate, {
    fields: [projects.templateId],
    references: [projectTemplate.id],
  }),
  contractToProject: many(contractToProject),
  customer: one(customerInformation, {
    fields: [projects.customerId],
    references: [customerInformation.id],
  }),
}));

export const contractToProjectRelations = relations(
  contractToProject,
  ({ one }) => ({
    contract: one(contract, {
      fields: [contractToProject.contractId],
      references: [contract.id],
    }),
    project: one(projects, {
      fields: [contractToProject.projectId],
      references: [projects.id],
    }),
  })
);
