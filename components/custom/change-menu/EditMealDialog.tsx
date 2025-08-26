"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuItem } from "@/lib/types/menu";
import { createClient } from "@/utils/supabase/client";
import ImageUpload from "./ImageUpload";

interface EditMealDialogProps {
  item: MenuItem | null;
  onUpdate: (item: MenuItem) => void;
  onClose: () => void;
}

export default function EditMealDialog({
  item,
  onUpdate,
  onClose,
}: EditMealDialogProps) {
  const [form, setForm] = useState<Partial<MenuItem> | null>(item);
  const supabase = createClient();

  useEffect(() => {
    setForm(item);
  }, [item]);

  const handleUpdate = async () => {
    if (!form || !form.id) return;

    const { data, error } = await supabase
      .from("meals")
      .update({
        name: form.name,
        description: form.description,
        price: form.price,
        image_url: form.image_url,
      })
      .eq("id", form.id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      alert("Failed to update meal.");
    } else {
      onUpdate(data as MenuItem);
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-green-900">Edit Menu Item</DialogTitle>
        </DialogHeader>
        {form && (
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                value={form.price || 0}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <ImageUpload
              currentImageUrl={form.image_url}
              onImageUpload={(url) => setForm({ ...form, image_url: url })}
              onImageRemove={() => setForm({ ...form, image_url: "" })}
            />
            <Button
              className="w-full bg-green-900 hover:bg-green-800 text-white"
              onClick={handleUpdate}
            >
              Update Menu Item
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
