import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Sidebar } from "./(components)/sidebar";
import AuthProvider from "./(context)/AuthProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error: authUserError } = await supabase.auth.getUser();

  const isPrepwiseDomain = (await headers()).get("host")?.includes("prepwise");
  const redirectPath = isPrepwiseDomain ? "/login" : "/super-admin/login";

  // if (authUserError || !data?.user) {
  //   redirect(redirectPath);
  // }

  const { data: user, error } = await supabase
    .from("superusers")
    .select("*")
    .eq("auth_user_id", data.user?.id)
    .single();

  if (error || !user) {
    console.log("here error")
    console.error(error);
    redirect(redirectPath);
  }

  return (
    <div className="flex min-h-screen">
      <AuthProvider user={user}>
        <Sidebar />
        <div className="flex-1">{children}</div>
      </AuthProvider>
    </div>
  );
}
