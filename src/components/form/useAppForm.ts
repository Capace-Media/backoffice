import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

import { TextField } from "./ui/input";
import { TextareaField } from "./ui/textarea-field";
import { SelectField } from "./ui/select-field";
import { SubmitButton } from "./ui/submit-button";

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Input: TextField,
    Textarea: TextareaField,
    Select: SelectField,
  },
  formComponents: {
    Submit: SubmitButton,
  },
});

export default useAppForm;
