"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function loginWithGoogle() {
  const supabase = await createClient();

  const hdrs = headers();
  const origin =
    (await hdrs).get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Google login error:", error.message);
    redirect(`/error?error=${encodeURIComponent(error.message)}`);
  }

  if (data?.url) redirect(data.url);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data: signUpData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup error:", error.message);
    redirect(`/error?error=${encodeURIComponent(error.message)}`);
  }

  // If signup is successful, redirect to a verification page
  redirect("/login/verify-email");
}
