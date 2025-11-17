import React from "react";
import { useFieldContext } from "../useAppForm";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

type TextareaFieldProps = {
  label: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaField = ({ label, ...inputProps }: TextareaFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor={field.name}>{label}</Label>
        <Textarea
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          {...inputProps}
        />
      </div>
    </div>
  );
};
