"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildRedirectUrl, getRequiredString } from "@/lib/utils";

const invalidSignInMessage = "Unable to sign in with those credentials.";
const invalidSignUpMessage = "Unable to create an account with those details.";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function signInAction(formData: FormData) {
  const email = getRequiredString(formData, "email", { maxLength: 320 }).toLowerCase();
  const password = getRequiredString(formData, "password", { maxLength: 1024 });

  if (!isEmail(email)) {
    redirect(buildRedirectUrl("/login", { error: invalidSignInMessage }));
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(buildRedirectUrl("/login", { error: invalidSignInMessage }));
  }

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const fullName = getRequiredString(formData, "fullName", { maxLength: 120 });
  const email = getRequiredString(formData, "email", { maxLength: 320 }).toLowerCase();
  const password = getRequiredString(formData, "password", { maxLength: 1024 });
  const confirmPassword = getRequiredString(formData, "confirmPassword", { maxLength: 1024 });

  if (!isEmail(email) || password.length < 8) {
    redirect(buildRedirectUrl("/signup", { error: invalidSignUpMessage }));
  }

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
    redirect(buildRedirectUrl("/signup", { error: invalidSignUpMessage }));
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
