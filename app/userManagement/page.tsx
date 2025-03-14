'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2 } from 'lucide-react';

const initialUsers = [
  { id: 1, username: 'Namo', role: 'Farmer', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 2, username: 'Title', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 3, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true }
];

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="p-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">Back</Button>
      <h1 className="text-xl font-bold mb-4">User Management</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add User</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit User</DialogTitle>
          </DialogHeader>
          {/* Form for adding/editing user (not implemented yet) */}
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Active Shop</TableHead>
            <TableHead>Active Farm</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.lastUpdated}</TableCell>
              <TableCell><Checkbox checked={user.activeShop} /></TableCell>
              <TableCell><Checkbox checked={user.activeFarm} /></TableCell>
              <TableCell>
                <Button variant="ghost" size="icon"><Pencil size={16} /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}>
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
