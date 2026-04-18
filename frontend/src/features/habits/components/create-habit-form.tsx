import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { createHabitAction } from "@/features/habits/actions";

type CreateHabitFormCopy = {
  title: string;
  description: string;
  name: string;
  namePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  targetDays: string;
  pending: string;
  submit: string;
};

type CreateHabitFormProps = {
  copy: CreateHabitFormCopy;
};

export function CreateHabitForm({ copy }: CreateHabitFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createHabitAction} className="space-y-4">
          <label className="block space-y-2 text-sm font-medium">
            <span>{copy.name}</span>
            <Input name="name" placeholder={copy.namePlaceholder} required />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>{copy.descriptionLabel}</span>
            <Input name="description" placeholder={copy.descriptionPlaceholder} />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>{copy.targetDays}</span>
            <Input defaultValue={7} max={7} min={1} name="frequencyPerWeek" required type="number" />
          </label>

          <SubmitButton className="w-full" pendingLabel={copy.pending}>
            {copy.submit}
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}