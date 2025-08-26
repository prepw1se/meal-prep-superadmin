"use client";

import { MoreHorizontal, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Merchant } from "@/lib/types/merchant";
import { createClient } from "@/utils/supabase/client";

export default function MerchantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMerchant, setNewMerchant] = useState({
    name: "",
    admin_name: "",
    admin_email: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("merchants")
        .select("id, name, admin_name, admin_email, is_active, created_at");

      if (error) throw error;

      const transformedData = data.map((client: any) => ({
        id: client.id,
        name: client.name,
        admin_name: client.admin_name,
        admin_email: client.admin_email,
        is_active: client.is_active,
        created_at: client.created_at
          ? new Date(client.created_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      }));

      setMerchants(transformedData);
    } catch (error) {
      console.error("Error fetching merchants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMerchant = async () => {
    if (!newMerchant.name || !newMerchant.admin_email) {
      alert("Business name and admin email are required");
      return;
    }

    try {
      const supabase = createClient();

      // First create the merchant
      const { data: merchantData, error: merchantError } = await supabase
        .from("merchants")
        .insert([
          {
            name: newMerchant.name,
            admin_email: newMerchant.admin_email,
            admin_name:
              newMerchant.admin_name || newMerchant.admin_email.split("@")[0],
            is_active: false,
          },
        ])
        .select()
        .single();

      if (merchantError) throw merchantError;

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            merchant_id: merchantData.id,
            name: newMerchant.admin_name,
            email: newMerchant.admin_email,
            role: "owner",
          },
        ])
        .select();

      if (error) {
        // Rollback merchant creation if user creation fails
        await supabase.from("merchants").delete().eq("id", merchantData.id);
        throw error;
      }

      // Add the new merchant with actual values
      const newMerchantWithDefaults = {
        id: merchantData.id,
        name: merchantData.name,
        admin_name: merchantData.admin_name,
        admin_email: merchantData.admin_email,
        is_active: merchantData.is_active,
        created_at: new Date().toISOString().split("T")[0],
      };

      setMerchants([...merchants, newMerchantWithDefaults]);
      setNewMerchant({ name: "", admin_name: "", admin_email: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating merchant:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Merchants</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Merchant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Merchant</DialogTitle>
              <DialogDescription>
                Add a new merchant to the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Business Name</label>
                <Input
                  placeholder="Enter business name"
                  value={newMerchant.name}
                  onChange={(e) =>
                    setNewMerchant({ ...newMerchant, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Admin Name</label>
                <Input
                  placeholder="Enter admin name"
                  value={newMerchant.admin_name}
                  onChange={(e) =>
                    setNewMerchant({
                      ...newMerchant,
                      admin_name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Admin Email</label>
                <Input
                  type="email"
                  placeholder="Enter admin email"
                  value={newMerchant.admin_email}
                  onChange={(e) =>
                    setNewMerchant({
                      ...newMerchant,
                      admin_email: e.target.value,
                    })
                  }
                />
              </div>
              <Button className="w-full" onClick={handleCreateMerchant}>
                Create Merchant
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search merchants..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              merchants
                .filter((merchant) =>
                  merchant.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
                )
                .map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">
                      {merchant.name}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{merchant.admin_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {merchant.admin_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          merchant.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {merchant.is_active ? "Active" : "Inactive"}
                      </div>
                    </TableCell>
                    <TableCell>{merchant.created_at}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
