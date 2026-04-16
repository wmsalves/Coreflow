"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildRedirectUrl, getRequiredString } from "@/lib/utils";

export async function signInAction(formData: FormData) {
  const email = getRequiredString(formData, "email");
  const password = getRequiredString(formData, "password");
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(buildRedirectUrl("/login", { error: error.message }));
  }

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const fullName = getRequiredString(formData, "fullName");
  const email = getRequiredString(formData, "email");
  const password = getRequiredString(formData, "password");
  const confirmPassword = getRequiredString(formData, "confirmPassword");

  if (password !== confirmPassword) {
    redirect(buildRedirectUrl("/signup", { error: "Passwords do not match." }));
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(buildRedirectUrl("/signup", { error: error.message }));
  }

  if (!data.session) {
    redirect(
      buildRedirectUrl("/login", {
        message: "Account created. Confirm your email in Supabase, then sign in.",
      }),
    );
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();

  await supabase.auth.signOut();

  redirect("/login");
}
