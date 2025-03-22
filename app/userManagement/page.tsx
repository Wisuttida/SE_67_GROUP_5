'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Check, X } from 'lucide-react';

const initialUsers = [
  { id: 1, username: 'Namo', role: 'Farmer', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 2, username: 'Title', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 3, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 4, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 5, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 6, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 7, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 8, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 9, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 10, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
];

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [tempData, setTempData] = useState<{ activeShop: boolean; activeFarm: boolean }>({ activeShop: false, activeFarm: false });

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleEdit = (user: any) => {
    setEditUserId(user.id);
    setTempData({ activeShop: user.activeShop, activeFarm: user.activeFarm });
  };

  const handleSave = (id: number) => {
    setUsers(users.map(user => user.id === id ? { ...user, ...tempData } : user));
    setEditUserId(null);
  };

  const handleCancel = () => {
    setEditUserId(null);
  };

  return (
    <div className="p-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">Back</Button>
      <h1 className="text-xl font-bold mb-4">User Management</h1>

      {/* เพิ่ม max-h ให้ scroll ได้ และ overflow-y */}
      <div className="relative max-h-[500px] overflow-y-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-white sticky top-0 z-10 shadow">
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
                <TableCell>
                  {editUserId === user.id ? (
                    <Checkbox
                      checked={tempData.activeShop}
                      onCheckedChange={(checked) => setTempData(prev => ({ ...prev, activeShop: !!checked }))}
                    />
                  ) : (
                    <Checkbox checked={user.activeShop} disabled />
                  )}
                </TableCell>
                <TableCell>
                  {editUserId === user.id ? (
                    <Checkbox
                      checked={tempData.activeFarm}
                      onCheckedChange={(checked) => setTempData(prev => ({ ...prev, activeFarm: !!checked }))}
                    />
                  ) : (
                    <Checkbox checked={user.activeFarm} disabled />
                  )}
                </TableCell>
                <TableCell>
                  {editUserId === user.id ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleSave(user.id)} title="Save">
                        <Check size={16} className="text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancel} title="Cancel">
                        <X size={16} className="text-red-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)} title="Delete">
                        <Trash2 size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} title="Edit" className="w-20">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)} title="Delete">
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

  );
}
