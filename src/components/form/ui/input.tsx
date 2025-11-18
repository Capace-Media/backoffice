import React from "react";

import { Input } from "@/components/ui/input";

import { useFieldContext } from "../useAppForm";

export const TextField = ({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const field = useFieldContext<string>();

  return (
    <Input
      id={field.name}
      aria-invalid={
        field.state.meta.isTouched && field.state.meta.errors.length > 0
      }
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      {...props}
    />
  );
};
