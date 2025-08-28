import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Merchant } from "@/lib/types/merchant";

interface MerchantTableProps {
  merchants: Merchant[];
  isLoading: boolean;
  searchQuery: string;
  onEdit: (merchant: Merchant) => void;
}

export default function MerchantTable({
  merchants,
  isLoading,
  searchQuery,
  onEdit,
}: MerchantTableProps) {
  const filtered = merchants.filter((merchant) =>
    merchant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((merchant) => (
              <TableRow key={merchant.id}>
                <TableCell className="font-medium">{merchant.name}</TableCell>
                <TableCell>
                  <div>
                    <div>{merchant.admin_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {merchant.admin_email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{merchant.slug}</TableCell>
                <TableCell>{merchant.domain}</TableCell>
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
                      <DropdownMenuItem onClick={() => onEdit(merchant)}>
                        Edit
                      </DropdownMenuItem>
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
  );
}
