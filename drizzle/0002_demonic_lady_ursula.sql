CREATE TYPE "public"."currency" AS ENUM('SEK', 'USD', 'EUR', 'GBP', 'DKK', 'NOK', 'CHF');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('one-time', 'monthly', 'yearly');--> statement-breakpoint
ALTER TABLE "project_template" ALTER COLUMN "default_currency" SET DEFAULT 'SEK'::"public"."currency";--> statement-breakpoint
ALTER TABLE "project_template" ALTER COLUMN "default_currency" SET DATA TYPE "public"."currency" USING "default_currency"::"public"."currency";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "currency" SET DEFAULT 'SEK'::"public"."currency";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "currency" SET DATA TYPE "public"."currency" USING "currency"::"public"."currency";--> statement-breakpoint
ALTER TABLE "project_template" ADD COLUMN "default_payment_type" "payment_type" DEFAULT 'one-time';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "payment_type" "payment_type" DEFAULT 'one-time' NOT NULL;