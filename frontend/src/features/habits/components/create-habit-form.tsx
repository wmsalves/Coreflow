import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { createHabitAction } from "@/features/habits/actions";

export function CreateHabitForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create habit</CardTitle>
        <CardDescription>
          Start with the smallest reliable version of the routine you want to keep.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createHabitAction} className="space-y-4">
          <label className="block space-y-2 text-sm font-medium">
            <span>Name</span>
            <Input name="name" placeholder="Read for 20 minutes" required />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>Description</span>
            <Input name="description" placeholder="Optional note or why it matters" />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>Target days per week</span>
            <Input defaultValue={7} max={7} min={1} name="frequencyPerWeek" required type="number" />
          </label>

          <SubmitButton className="w-full" pendingLabel="Creating habit...">
            Save habit
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
