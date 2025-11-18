import { Checkbox } from "@/components/ui/checkbox";
import { useFieldContext } from "../useAppForm";

export default function CheckboxField({
  ...props
}: React.ComponentProps<typeof Checkbox>) {
  const field = useFieldContext<boolean>();
  console.log(field.state.value);
  return (
    <Checkbox
      id={field.name}
      checked={field.state.value}
      onCheckedChange={(checked: boolean) => {
        field.handleChange(checked);
      }}
      onBlur={field.handleBlur}
      {...props}
    />
  );
}
