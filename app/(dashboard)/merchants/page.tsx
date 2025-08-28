'use client';

import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Merchant } from '@/lib/types/merchant';
import { createClient } from '@/utils/supabase/client';

export default function MerchantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMerchant, setNewMerchant] = useState({
    name: '',
    admin_name: '',
    admin_email: '',
    slug: '',
    domain: '',
    is_active: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editMerchant, setEditMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('merchants')
        .select(
          'id, name, admin_name, admin_email, domain, slug, is_active, created_at'
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
          ? new Date(merchant.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      }));

      setMerchants(transformedData);
    } catch (error) {
      console.error('Error fetching merchants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMerchant = async () => {
    if (!newMerchant.name || !newMerchant.admin_email) {
      alert('Business name and admin email are required');
      return;
    }

    try {
      const supabase = createClient();
      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .insert([
          {
            name: newMerchant.name,
            admin_email: newMerchant.admin_email,
            admin_name: newMerchant.admin_name,
            slug: newMerchant.slug,
            domain: newMerchant.domain,
            is_active: newMerchant.is_active,
          },
        ])
        .select()
        .single();

      if (merchantError) throw merchantError;

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            merchant_id: merchantData.id,
            name: newMerchant.admin_name,
            email: newMerchant.admin_email,
            role: 'owner',
          },
        ])
        .select();

      if (error) {
        await supabase.from('merchants').delete().eq('id', merchantData.id);
        throw error;
      }

      const newMerchantWithDefaults = {
        id: merchantData.id,
        name: merchantData.name,
        admin_name: merchantData.admin_name,
        admin_email: merchantData.admin_email,
        slug: merchantData.slug,
        domain: merchantData.domain,
        is_active: merchantData.is_active,
        created_at: new Date().toISOString().split('T')[0],
      };

      setMerchants([...merchants, newMerchantWithDefaults]);
      setNewMerchant({
        name: '',
        admin_name: '',
        admin_email: '',
        slug: '',
        domain: '',
        is_active: false,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating merchant:', error);
    }
  };

  const handleEditMerchant = async () => {
    if (!editMerchant) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('merchants')
        .update({
          slug: editMerchant.slug,
          domain: editMerchant.domain,
          is_active: editMerchant.is_active,
        })
        .eq('id', editMerchant.id)
        .select()
        .single();
      if (error) throw error;
      setMerchants(
        merchants.map((m) =>
          m.id === editMerchant.id ? { ...m, ...editMerchant } : m
        )
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating merchant:', error);
    }
  };

  return (
    <div className='flex min-h-screen flex-col p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Merchants</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
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
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>Business Name</label>
                <Input
                  placeholder='Enter business name'
                  value={newMerchant.name}
                  onChange={(e) =>
                    setNewMerchant({ ...newMerchant, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Admin Name</label>
                <Input
                  placeholder='Enter admin name'
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
                <label className='text-sm font-medium'>Admin Email</label>
                <Input
                  type='email'
                  placeholder='Enter admin email'
                  value={newMerchant.admin_email}
                  onChange={(e) =>
                    setNewMerchant({
                      ...newMerchant,
                      admin_email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Slug</label>
                <Input
                  placeholder='Enter slug'
                  value={newMerchant.slug ?? ''}
                  onChange={(e) =>
                    setNewMerchant({ ...newMerchant, slug: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Domain</label>
                <Input
                  placeholder='Enter domain'
                  value={newMerchant.domain ?? ''}
                  onChange={(e) =>
                    setNewMerchant({ ...newMerchant, domain: e.target.value })
                  }
                />
              </div>
              <div className='flex items-center space-x-2'>
                <label className='text-sm font-medium'>Active</label>
                <input
                  type='checkbox'
                  checked={newMerchant.is_active}
                  onChange={(e) =>
                    setNewMerchant({
                      ...newMerchant,
                      is_active: e.target.checked,
                    })
                  }
                />
              </div>
              <Button className='w-full' onClick={handleCreateMerchant}>
                Create Merchant
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Edit Merchant Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Merchant</DialogTitle>
              <DialogDescription>Edit merchant details.</DialogDescription>
            </DialogHeader>
            {editMerchant && (
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium'>Slug</label>
                  <Input
                    placeholder='Enter slug'
                    value={editMerchant.slug ?? ''}
                    onChange={(e) =>
                      setEditMerchant({ ...editMerchant, slug: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Domain</label>
                  <Input
                    placeholder='Enter domain'
                    value={editMerchant.domain ?? ''}
                    onChange={(e) =>
                      setEditMerchant({
                        ...editMerchant,
                        domain: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='flex items-center space-x-2'>
                  <label className='text-sm font-medium'>Active</label>
                  <input
                    type='checkbox'
                    checked={editMerchant.is_active}
                    onChange={(e) =>
                      setEditMerchant({
                        ...editMerchant,
                        is_active: e.target.checked,
                      })
                    }
                  />
                </div>
                <Button className='w-full' onClick={handleEditMerchant}>
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex items-center space-x-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search merchants...'
            className='pl-8'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center'>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              merchants
                .filter((merchant) =>
                  merchant.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className='font-medium'>
                      {merchant.name}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{merchant.admin_name}</div>
                        <div className='text-sm text-muted-foreground'>
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
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {merchant.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </TableCell>
                    <TableCell>{merchant.created_at}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditMerchant(merchant);
                              setEditDialogOpen(true);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className='text-red-600'>
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
