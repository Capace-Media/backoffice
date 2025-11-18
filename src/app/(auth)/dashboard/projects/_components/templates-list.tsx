"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    return (
      <ItemGroup className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Item variant="outline" key={i}>
            <ItemHeader>
              <Skeleton className="h-6 w-32" />
              <ItemActions>
                <Skeleton className="h-9 w-9 rounded-full" />
              </ItemActions>
            </ItemHeader>
            <ItemContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <ItemGroup className="grid grid-cols-3 gap-4">
      {data.map((template: any) => (
        <Item variant="outline" key={template.id}>
          <ItemHeader>
            <ItemTitle className="text-lg">{template.name}</ItemTitle>
            <ItemActions>
              <Button variant="ghost" size="icon" className="rounded-full">
                <PencilIcon />
              </Button>
            </ItemActions>
          </ItemHeader>
          <ItemContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {typeof template.defaultPrice === "number"
                  ? template.defaultPrice.toLocaleString("sv-SE")
                  : template.defaultPrice}
              </span>
              <span className="text-sm text-muted-foreground">
                {template.defaultCurrency}
              </span>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Payment:</span>
              <Badge
                variant={
                  template.defaultPaymentType === "one-time"
                    ? "default"
                    : template.defaultPaymentType === "monthly"
                    ? "secondary"
                    : "outline"
                }
              >
                {template.defaultPaymentType}
              </Badge>
            </div>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
