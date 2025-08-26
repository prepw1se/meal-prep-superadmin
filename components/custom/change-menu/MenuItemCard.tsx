"use client";

import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/lib/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={item.image_url}
        alt={item.name}
        className="rounded-lg w-48 h-48 object-cover"
      />
      <h3 className="mt-2 text-xl font-bold text-green-900">{item.name}</h3>
      <p className="text-gray-600">{item.description}</p>
      <p className="text-green-600 font-bold">£{item.price.toFixed(2)}</p>
      <div className="flex gap-2 mt-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Remove
        </Button>
      </div>
    </div>
  );
}
