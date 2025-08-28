"use client";

import { MoreHorizontal, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Merchant } from "@/lib/types/merchant";
import { createClient } from "@/utils/supabase/client";
import AddMerchantDialog from "./AddMerchantDialog";
import EditMerchantDialog from "./EditMerchantDialog";
import MerchantTable from "./MerchantTable";

export default function MerchantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editMerchant, setEditMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    fetchMerchants();
  }, []);

  async function fetchMerchants() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("merchants")
        .select(
          "id, name, admin_name, admin_email, domain, slug, is_active, created_at",
        );
      if (error) throw error;
      const transformedData = data.map((merchant: any) => ({
        id: merchant.id,
        name: merchant.name,
        admin_name: merchant.admin_name,
        admin_email: merchant.admin_email,
        is_active: merchant.is_active,
        slug: merchant.slug,
        domain: merchant.domain,
        created_at: merchant.created_at
          ? new Date(merchant.created_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      }));
      setMerchants(transformedData);
    } catch (error) {
      console.error("Error fetching merchants:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateMerchant(
    newMerchant: Omit<Merchant, "id" | "created_at">,
  ) {
    if (!newMerchant.name || !newMerchant.admin_email) {
      alert("Business name and admin email are required");
      return;
    }
    try {
      const supabase = createClient();
      const { data: merchantData, error: merchantError } = await supabase
        .from("merchants")
        .insert([
          {
            ...newMerchant,
          },
        ])
        .select()
        .single();
      if (merchantError) throw merchantError;
      const { error } = await supabase
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
        await supabase.from("merchants").delete().eq("id", merchantData.id);
        throw error;
      }
      setMerchants([
        ...merchants,
        {
          ...merchantData,
          created_at: new Date().toISOString().split("T")[0],
        },
      ]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error creating merchant:", error);
    }
  }

  async function handleEditMerchant(updatedMerchant: Merchant) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("merchants")
        .update({
          slug: updatedMerchant.slug,
          domain: updatedMerchant.domain,
          is_active: updatedMerchant.is_active,
        })
        .eq("id", updatedMerchant.id)
        .select()
        .single();
      if (error) throw error;
      setMerchants(
        merchants.map((m) =>
          m.id === updatedMerchant.id ? { ...m, ...updatedMerchant } : m,
        ),
      );
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating merchant:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Merchants</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Merchant
        </Button>
        <AddMerchantDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onCreate={handleCreateMerchant}
        />
        <EditMerchantDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          merchant={editMerchant}
          onEdit={handleEditMerchant}
        />
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
      <MerchantTable
        merchants={merchants}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onEdit={(merchant) => {
          setEditMerchant(merchant);
          setIsEditDialogOpen(true);
        }}
      />
    </div>
  );
}
