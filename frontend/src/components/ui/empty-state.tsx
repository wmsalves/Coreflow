import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: {
    href: string;
    label: string;
  };
};

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <Card className="border-dashed border-[var(--landing-border-strong)] bg-[linear-gradient(180deg,var(--landing-surface),transparent)] shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action ? (
        <CardContent>
          <Button asChild variant="secondary">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
