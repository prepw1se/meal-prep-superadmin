"use client";

import { User } from "@/lib/types/user";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
