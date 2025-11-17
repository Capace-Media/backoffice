CREATE TYPE "public"."project_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "contract" (
	"id" serial PRIMARY KEY NOT NULL,
	"contract" text NOT NULL,
	"customer_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_to_project" (
	"contract_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"contract_price" integer,
	"contract_terms" text,
	CONSTRAINT "contract_to_project_contract_id_project_id_pk" PRIMARY KEY("contract_id","project_id")
);
--> statement-breakpoint
CREATE TABLE "customer_information" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"address" text,
	"city" text,
	"state" text,
	"zip" text,
	"country" text,
	"notes" text,
	"organization_number" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_template" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"default_price" integer DEFAULT 0,
	"default_currency" text DEFAULT 'SEK',
	"default_terms_and_conditions" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_template_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer,
	"name" text NOT NULL,
	"description" text,
	"customer_id" integer,
	"terms_and_conditions" text,
	"price" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'SEK' NOT NULL,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text
);
--> statement-breakpoint
ALTER TABLE "contract_to_project" ADD CONSTRAINT "contract_to_project_contract_id_contract_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contract"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_to_project" ADD CONSTRAINT "contract_to_project_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_template_id_project_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."project_template"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "customer_information_organization_number_unique" ON "customer_information" USING btree ("organization_number");