import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/admin";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/super-admin/dashboard";

  if (code) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !user) {
      console.error("Auth error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/auth-code-error?error=${encodeURIComponent(
          error?.message || "User not found",
        )}`,
      );
    }

    // Check if the user's email exists in users table
    const { data: userData, error: userError } = await supabase
      .from("superusers")
      .select("id, name, email, auth_user_id")
      .eq("email", user.email)
      .single();

    if (userError || !userData) {
      console.error("User verification error:", userError || "No user found");
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/auth-code-error?error=${encodeURIComponent(
          "Here.",
        )}`,
      );
    }

    // Update user metadata with merchant information
    // might need to fix with supabase admin key (currently anon key)
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          merchant_id: userData.id,
          role: "super-admin",
        },
      },
    );

    if (updateError) {
      console.error("User metadata update error:", updateError);
      // Continue anyway as the main authentication was successful
    }

    if (!userData.auth_user_id) {
      const { error: updateError } = await supabase
        .from("superusers")
        .update({ auth_user_id: user.id })
        .eq("id", userData.id);

      if (updateError) {
        console.error("Error updating user:", updateError.message);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/auth-code-error?error=${encodeURIComponent(
            "Access denied. Please contact your administrator.",
          )}`,
        );
      }
    }

    return NextResponse.redirect("http://prepwise.local:3000/dashboard");
  }

  // More informative error redirect
  return NextResponse.redirect(
    `${new URL(request.url).origin}/auth/auth-code-error?error=missing_code`,
  );
}
