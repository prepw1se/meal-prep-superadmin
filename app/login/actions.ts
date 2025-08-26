"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/super-admin/dashboard");
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  
  const hdrs = headers();
  
  const host = (await hdrs).get("host") || "";
  const isPrepwiseDomain = host.includes("prepwise");
  const origin =
    (await hdrs).get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  // Set different callback URLs based on the domain
  const callbackPath = isPrepwiseDomain
    ? "/auth/callback" // For prepwise.localhost:3000/login -> /auth/callback
    : "/super-admin/auth/callback"; // For localhost:3000/super-admin/login -> /super-admin/auth/callback

  console.log("origin", origin);
  console.log("callbackPath", callbackPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}${callbackPath}`,
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
