import { HabitsWorkspace } from "@/features/habits/components/habits-workspace";
import { getHabitsOverview } from "@/features/habits/queries";
import { requireUser } from "@/lib/auth";

export default async function HabitsPage() {
  const user = await requireUser();
  const overview = await getHabitsOverview(user.id);

  return <HabitsWorkspace overview={overview} />;
}