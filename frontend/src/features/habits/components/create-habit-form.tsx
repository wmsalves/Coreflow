"use client";

import type { RefObject } from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { StatusNotice } from "@/components/ui/status-notice";
import { SubmitButton } from "@/components/ui/submit-button";
import { createHabitAction, type HabitActionState } from "@/features/habits/actions";

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
  success: string;
  successHint: string;
};

type CreateHabitFormProps = {
  copy: CreateHabitFormCopy;
};

const initialState: HabitActionState = {
  error: null,
  success: false,
};

export function CreateHabitForm({ copy }: CreateHabitFormProps) {
  const desktopFormRef = useRef<HTMLFormElement>(null);
  const mobileFormRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createHabitAction, initialState);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      desktopFormRef.current?.reset();
      mobileFormRef.current?.reset();
      window.setTimeout(() => setMobileSheetOpen(false), 0);
    }
  }, [state.success]);

  return (
    <div className="contents" id="create-habit">
      <div className="sm:hidden">
        <MobileSheet
          description={copy.description}
          open={mobileSheetOpen}
          title={copy.title}
          trigger={
            <Button className="w-full" size="lg">
              <Plus className="size-4" />
              {copy.submit}
            </Button>
          }
          onOpenChange={setMobileSheetOpen}
        >
          <HabitForm
            copy={copy}
            formAction={formAction}
            formRef={mobileFormRef}
            guided
            state={state}
          />
        </MobileSheet>
      </div>

      <Card className="hidden sm:block">
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <HabitForm
            copy={copy}
            formAction={formAction}
            formRef={desktopFormRef}
            state={state}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function HabitForm({
  copy,
  formAction,
  formRef,
  guided = false,
  state,
}: {
  copy: CreateHabitFormCopy;
  formAction: (payload: FormData) => void;
  formRef: RefObject<HTMLFormElement | null>;
  guided?: boolean;
  state: HabitActionState;
}) {
  return (
    <form action={formAction} className="space-y-4" ref={formRef}>
      <div className={guided ? "space-y-4 rounded-[1.1rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-3" : "space-y-4"}>
        {guided ? <StepLabel index={1} title={copy.name} /> : null}
        <label className="block space-y-2 text-sm font-medium">
          <span>{copy.name}</span>
          <Input name="name" placeholder={copy.namePlaceholder} required />
        </label>

        <label className="block space-y-2 text-sm font-medium">
          <span>{copy.descriptionLabel}</span>
          <Input name="description" placeholder={copy.descriptionPlaceholder} />
        </label>
      </div>

      <div className={guided ? "space-y-4 rounded-[1.1rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-3" : "space-y-4"}>
        {guided ? <StepLabel index={2} title={copy.targetDays} /> : null}
        <label className="block space-y-2 text-sm font-medium">
          <span>{copy.targetDays}</span>
          <Input defaultValue={7} max={7} min={1} name="frequencyPerWeek" required type="number" />
        </label>
      </div>

      <SubmitButton className="w-full" pendingLabel={copy.pending}>
        {copy.submit}
      </SubmitButton>

      {state.error ? (
        <StatusNotice variant="error">{state.error}</StatusNotice>
      ) : null}

      {state.success ? (
        <StatusNotice variant="success">
          <div aria-live="polite">
            <p>{copy.success}</p>
            <p className="mt-1 text-sm text-[var(--landing-text-muted)]">{copy.successHint}</p>
          </div>
        </StatusNotice>
      ) : null}
    </form>
  );
}

function StepLabel({ index, title }: { index: number; title: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-faint)]">
      {index.toString().padStart(2, "0")} / {title}
    </p>
  );
}
