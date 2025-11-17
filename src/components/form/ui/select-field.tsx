import React from "react";
import { useFieldContext } from "../useAppForm";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

type SelectFieldProps = {
  label: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = ({
  label,
  options,
  ...inputProps
}: SelectFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-1">
      <Label htmlFor={field.name}>{label}</Label>
      <NativeSelect
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...inputProps}
      >
        {options.map((option: { value: string; label: string }) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
};
