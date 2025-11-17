import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormContext } from "../useAppForm";

interface SubmitButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function SubmitButton(props: SubmitButtonProps) {
  const { disabled = false } = props;
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <Button
          type="submit"
          size="default"
          disabled={isSubmitting || !canSubmit || disabled}
          className={cn(
            isSubmitting || !canSubmit || (disabled && "cursor-not-allowed"),
            props.className
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {props.children}
            </>
          ) : (
            props.children
          )}
        </Button>
      )}
    </form.Subscribe>
  );
}
