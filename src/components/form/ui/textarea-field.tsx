import React from "react";
import { useFieldContext } from "../useAppForm";

import { Textarea } from "@/components/ui/textarea";

export const TextareaField = ({
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const field = useFieldContext<string>();

  return (
    <Textarea
      id={field.name}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      {...props}
    />
  );
};
