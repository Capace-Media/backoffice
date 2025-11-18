import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useFormContext } from "../useAppForm";
import React from "react";
import { Spinner } from "@/components/ui/spinner";

type SubmitButtonProps = {
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SubmitButton = ({ children, ...props }: SubmitButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <Button
          type="submit"
          size="default"
          disabled={isSubmitting || !canSubmit || props.disabled}
          className={cn(
            isSubmitting ||
              !canSubmit ||
              (props.disabled && "cursor-not-allowed"),
            props.className
          )}
        >
          {isSubmitting ? (
            <>
              <Spinner />
              {children}
            </>
          ) : (
            children
          )}
        </Button>
      )}
    </form.Subscribe>
  );
};
