"use client";

import type { RefObject } from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MobileSheet } from "@/components/ui/mobile-sheet";
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
    <>
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
    </>
  );
}

function HabitForm({
  copy,
  formAction,
  formRef,
  state,
}: {
  copy: CreateHabitFormCopy;
  formAction: (payload: FormData) => void;
  formRef: RefObject<HTMLFormElement | null>;
  state: HabitActionState;
}) {
  return (
    <form action={formAction} className="space-y-4" ref={formRef}>
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

      {state.error ? (
        <p aria-live="polite" className="text-sm text-[var(--danger)]">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
