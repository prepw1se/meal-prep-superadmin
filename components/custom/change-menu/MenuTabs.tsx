"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MenuTabs() {
  const router = useRouter();

  return (
    <div className="flex justify-center mb-6 space-x-4">
      <Button
        onClick={() => router.push("/meals")}
        size="lg"
        className="bg-green-900 hover:bg-green-800 text-white"
      >
        Change Menu
      </Button>
      <Button
        onClick={() => router.push("/orders")}
        size="lg"
        className="bg-green-900 hover:bg-green-800 text-white"
      >
        Orders
      </Button>
      <Button
        onClick={() => router.push("/requests")}
        className="bg-red-600 hover:bg-red-700 text-white flex items-center"
      >
        <Bell className="h-5 w-5 mr-2" />
        View Help Requests
      </Button>
    </div>
  );
}
