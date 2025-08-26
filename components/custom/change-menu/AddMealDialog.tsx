"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuItem } from "@/lib/types/menu";
import { createClient } from "@/utils/supabase/client";
import ImageUpload from "./ImageUpload";

interface AddMealDialogProps {
  onAdd: (item: MenuItem) => void;
}

export default function AddMealDialog({ onAdd }: AddMealDialogProps) {
  const supabase = createClient();
  const [newMeal, setNewMeal] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    available: true,
    image_url: "",
  });

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from("meals")
      .insert([newMeal])
      .select()
      .single();

    if (error) {
      console.error("Error adding meal:", error);
      alert("Failed to add meal.");
    } else {
      onAdd(data as MenuItem);
      setNewMeal({
        name: "",
        description: "",
        price: 0,
        available: true,
        image_url: "",
        quantity: 0,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-green-900 hover:bg-green-800">
          <Plus className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-green-900">
            Add New Menu Item
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newMeal.description}
              onChange={(e) =>
                setNewMeal({ ...newMeal, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={newMeal.price}
              onChange={(e) =>
                setNewMeal({
                  ...newMeal,
                  price: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          <ImageUpload
            currentImageUrl={newMeal.image_url}
            onImageUpload={(url) => setNewMeal({ ...newMeal, image_url: url })}
            onImageRemove={() => setNewMeal({ ...newMeal, image_url: "" })}
          />
          <Button
            className="w-full bg-green-900 hover:bg-green-800 text-white"
            onClick={handleAdd}
          >
            Add Menu Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
