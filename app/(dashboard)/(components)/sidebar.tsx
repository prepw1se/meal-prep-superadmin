"use client";

import {
  BarChart,
  Calendar,
  ChevronDown,
  ClipboardList,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "../(context)/AuthContext";

const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/clients", label: "Clients", icon: Users },
];

export function Sidebar() {
  const supabase = createClient();

  const { user } = useAuth();

  const pathname = usePathname();
  const PATH = "/super-admin";

  if (pathname === "/") return null;

  const isActive = (path: string) =>
    pathname === `${PATH}${path}` || pathname.startsWith(`${PATH}${path}/`);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    redirect("/super-admin/login");
  };

  return (
    <div>
      <div className="hidden border-r bg-background md:block md:w-64">
        <div className="flex h-16 items-center border-b px-4">
          <Link
            href={`${PATH}/dashboard`}
            className="flex items-center gap-2 font-bold text-xl"
          >
            <span>Super Admin Panel</span>
          </Link>
        </div>
        <div className="flex flex-col gap-1 p-4">
          {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => {
            const fullPath = `${PATH}${href}`;
            return (
              <Link key={href} href={fullPath}>
                <Button
                  variant={isActive(href) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              </Link>
            );
          })}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
