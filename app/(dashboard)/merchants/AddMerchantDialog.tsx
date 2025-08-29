import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Merchant } from "@/lib/types/merchant";

interface AddMerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (merchant: Omit<Merchant, "id" | "created_at">) => void;
}

export default function AddMerchantDialog({
  open,
  onOpenChange,
  onCreate,
}: AddMerchantDialogProps) {
  const [form, setForm] = useState<Omit<Merchant, "id" | "created_at">>({
    name: "",
    admin_name: "",
    admin_email: "",
    slug: "",
    domain: "",
    is_active: false,
  });

  function handleSubmit() {
    onCreate(form);
    setForm({
      name: "",
      admin_name: "",
      admin_email: "",
      slug: "",
      domain: "",
      is_active: false,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Admin Name</label>
            <Input
              placeholder="Enter admin name"
              value={form.admin_name}
              onChange={(e) => setForm({ ...form, admin_name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Admin Email</label>
            <Input
              type="email"
              placeholder="Enter admin email"
              value={form.admin_email}
              onChange={(e) =>
                setForm({ ...form, admin_email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Slug</label>
            <Input
              placeholder="Enter slug"
              value={form.slug ?? ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Domain</label>
            <Input
              placeholder="Enter domain"
              value={form.domain ?? ""}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Active</label>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Create Merchant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
