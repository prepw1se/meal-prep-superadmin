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
import { Client } from '@/lib/types/client';
import { createClient } from '@/utils/supabase/client';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newClient, setNewClient] = useState({
    name: '',
    admin_name: '',
    admin_email: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('merchants')
        .select('id, name, admin_name, admin_email, is_active, created_at');

      if (error) throw error;

      const transformedData = data.map((client: any) => ({
        id: client.id,
        name: client.name,
        admin_name: client.admin_name,
        admin_email: client.admin_email,
        is_active: client.is_active,
        createdAt: client.created_at
          ? new Date(client.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      }));

      setClients(transformedData);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.admin_email) {
      alert('Business name and admin email are required');
      return;
    }

    try {
      const supabase = createClient();

      // First create the merchant
      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .insert([
          {
            name: newClient.name,
            admin_email: newClient.admin_email,
            admin_name:
              newClient.admin_name || newClient.admin_email.split('@')[0],
            is_active: false,
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
            name: newClient.admin_name,
            email: newClient.admin_email,
            role: 'owner',
          },
        ])
        .select();

      if (error) {
        // Rollback merchant creation if user creation fails
        await supabase.from('merchants').delete().eq('id', merchantData.id);
        throw error;
      }

      // Add the new client with actual values
      const newClientWithDefaults = {
        id: merchantData.id,
        name: merchantData.name,
        admin_name: merchantData.admin_name,
        admin_email: merchantData.admin_email,
        is_active: merchantData.is_active,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setClients([...clients, newClientWithDefaults]);
      setNewClient({ name: '', admin_name: '', admin_email: '' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <div className='flex min-h-screen flex-col p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Clients</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Add a new client to the platform.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>Business Name</label>
                <Input
                  placeholder='Enter business name'
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Admin Name</label>
                <Input
                  placeholder='Enter admin name'
                  value={newClient.admin_name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, admin_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Admin Email</label>
                <Input
                  type='email'
                  placeholder='Enter admin email'
                  value={newClient.admin_email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, admin_email: e.target.value })
                  }
                />
              </div>
              <Button className='w-full' onClick={handleCreateClient}>
                Create Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex items-center space-x-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search clients...'
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
              clients
                .filter((client) =>
                  client.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className='font-medium'>{client.name}</TableCell>
                    <TableCell>
                      <div>
                        <div>{client.admin_name}</div>
                        <div className='text-sm text-muted-foreground'>
                          {client.admin_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          client.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {client.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </TableCell>
                    <TableCell>{client.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
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
