import React from "react";
import { useFieldContext } from "../useAppForm";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

type SelectFieldProps = {
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = ({ options, ...props }: SelectFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <NativeSelect
      id={field.name}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      {...props}
    >
      {options.map((option: { value: string; label: string }) => (
        <NativeSelectOption key={option.value} value={option.value}>
          {option.label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
};
