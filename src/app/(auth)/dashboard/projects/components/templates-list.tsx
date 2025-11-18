"use client";

import { useQuery } from "@tanstack/react-query";

export default function TemplatesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await fetch("/api/project/templates");
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <ul>
      {data.map((template: any) => (
        <li key={template.id}>{template.name}</li>
      ))}
    </ul>
  );
}
