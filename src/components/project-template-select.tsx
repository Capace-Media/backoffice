"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectTemplate {
  id: number;
  name: string;
  description: string | null;
}

interface ProjectTemplateSelectProps {
  templates: ProjectTemplate[];
  defaultValue?: string;
}

export function ProjectTemplateSelect({
  templates,
  defaultValue,
}: ProjectTemplateSelectProps) {
  return (
    <Select name="templateId" defaultValue={defaultValue}>
      <SelectTrigger id="templateId" className="w-full">
        <SelectValue placeholder="Select a template or create custom" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Custom Project</SelectItem>
        {templates.map((template) => (
          <SelectItem key={template.id} value={template.id.toString()}>
            {template.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
