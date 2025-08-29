import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Merchant } from "@/lib/types/merchant";

interface EditMerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: Merchant | null;
  onEdit: (merchant: Merchant) => void;
}

export default function EditMerchantDialog({
  open,
  onOpenChange,
  merchant,
  onEdit,
}: EditMerchantDialogProps) {
  const [form, setForm] = useState<Merchant | null>(merchant);

  useEffect(() => {
    setForm(merchant);
  }, [merchant]);

  if (!form) return null;

  function handleSubmit() {
    if (form) {
      onEdit(form);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Merchant</DialogTitle>
          <DialogDescription>Edit merchant details.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
