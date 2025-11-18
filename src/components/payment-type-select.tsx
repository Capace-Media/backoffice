"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentTypeSelectProps {
  name: string;
  defaultValue?: "one-time" | "monthly" | "yearly";
  id?: string;
  className?: string;
}

export function PaymentTypeSelect({
  name,
  defaultValue = "one-time",
  id,
  className,
}: PaymentTypeSelectProps) {
  return (
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger id={id || name} className={className}>
        <SelectValue placeholder="Select payment type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="one-time">One-time Payment</SelectItem>
        <SelectItem value="monthly">Monthly Subscription</SelectItem>
        <SelectItem value="yearly">Yearly Subscription</SelectItem>
      </SelectContent>
    </Select>
  );
}
