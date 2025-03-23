'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Check, X } from 'lucide-react';

const initialUsers = [
  { id: 1, username: 'Namo', role: 'Farmer', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 2, username: 'Title', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 3, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 4, username: 'John', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 5, username: 'Jane', role: 'Farmer', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 6, username: 'Doe', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 6, username: 'Doe', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 6, username: 'Doe', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 6, username: 'Doe', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 6, username: 'Doe', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 6, username: 'Doe', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
];

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [tempData, setTempData] = useState<{ activeShop: boolean; activeFarm: boolean }>({ activeShop: false, activeFarm: false });

  const deleteUser = (id: number) => setUsers(users.filter(user => user.id !== id));

  const handleEdit = (user: any) => {
    setEditUserId(user.id);
    setTempData({ activeShop: user.activeShop, activeFarm: user.activeFarm });
  };

  const handleSave = (id: number) => {
    setUsers(users.map(user => user.id === id ? { ...user, ...tempData } : user));
    setEditUserId(null);
  };

  const handleCancel = () => setEditUserId(null);

  return (
    <div className="relative">
      {/* Fixed Page Header */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 p-4 shadow flex items-center">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">Back</Button>
        <h1 className="text-xl font-bold">User Management</h1>
      </div>

      {/* Add padding to prevent overlap */}
      <div className="pt-28 p-6">
        <div className="overflow-auto max-h-[70vh] border rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40">Username</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40">Role</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40">Last Updated</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40">Active Shop</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40">Active Farm</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="p-2 border">{user.username}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border text-center align-middle">{user.lastUpdated}</td>
                  <td className="p-2 border text-center align-middle">
                    {editUserId === user.id ? (
                      <Checkbox
                        checked={tempData.activeShop}
                        onCheckedChange={(checked) => setTempData(prev => ({ ...prev, activeShop: !!checked }))}
                      />
                    ) : (
                      <Checkbox checked={user.activeShop} disabled />
                    )}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {editUserId === user.id ? (
                      <Checkbox
                        checked={tempData.activeFarm}
                        onCheckedChange={(checked) => setTempData(prev => ({ ...prev, activeFarm: !!checked }))}
                      />
                    ) : (
                      <Checkbox checked={user.activeFarm} disabled />
                    )}
                  </td>
                  <td className="p-2 border text-center align-middle">
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
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} title="Edit" className='w-20'>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)} title="Delete">
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
