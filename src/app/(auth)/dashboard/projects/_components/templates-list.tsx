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
import { buttonVariants } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { PaginationController } from "@/components/pagination-controller";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TemplatesList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const { data, isLoading, error } = useQuery({
    queryKey: ["templates", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/project/templates?page=${page}&limit=${limit}`
      );
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
  });
  if (isLoading) {
    return (
      <>
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
      </>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const templates = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex justify-end pt-4"></div>
      <ItemGroup className="grid grid-cols-3 gap-4">
        {templates.map((template: any) => (
          <Item variant="outline" key={template.id}>
            <ItemHeader>
              <ItemTitle className="text-lg">{template.name}</ItemTitle>
              <ItemActions>
                <Link
                  href={`/dashboard/projects/templates/${template.id}`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "rounded-full"
                  )}
                >
                  <PencilIcon />
                </Link>
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

      {pagination && (
        <PaginationController
          page={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
