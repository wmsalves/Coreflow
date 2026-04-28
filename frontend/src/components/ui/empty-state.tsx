import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  hint?: string;
  action?: {
    href: string;
    label: string;
  };
};

export function EmptyState({ action, description, hint, title }: EmptyStateProps) {
  return (
    <Card className="border-dashed border-[var(--landing-border-strong)] bg-[linear-gradient(180deg,var(--landing-surface),transparent)] shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {hint ? (
          <p className="text-sm leading-[1.55] text-[var(--landing-text-soft)]">{hint}</p>
        ) : null}
      </CardHeader>
      {action ? (
        <CardContent className="pt-1">
          <Button asChild variant="secondary">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
