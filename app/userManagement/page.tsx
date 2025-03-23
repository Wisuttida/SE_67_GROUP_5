'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Check, X } from 'lucide-react';

// ประกาศ Type
type User = {
  id: number;
  username: string;
  role: string;
  lastUpdated: string;
  activeShop: boolean;
  activeFarm: boolean;
};

type SortConfig = {
  key: keyof User;
  direction: 'asc' | 'desc';
};

const initialUsers: User[] = [
  { id: 1, username: 'Namo', role: 'Farmer', lastUpdated: 'DD/MM/YY', activeShop: false, activeFarm: false },
  { id: 2, username: 'Title', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: false },
  { id: 3, username: 'Bas', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: false, activeFarm: true },
  { id: 4, username: 'John', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: true, activeFarm: true },
  { id: 5, username: 'Jane', role: 'Farmer', lastUpdated: 'DD/MM/YY', activeShop: false, activeFarm: false },
  { id: 6, username: 'Doe', role: 'Entrepreneur', lastUpdated: 'DD/MM/YY', activeShop: false, activeFarm: false },
];

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [tempData, setTempData] = useState<{ activeShop: boolean; activeFarm: boolean }>({ activeShop: false, activeFarm: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'username', direction: 'asc' });

  const deleteUser = (id: number) => setUsers(users.filter(user => user.id !== id));

  const handleEdit = (user: User) => {
    setEditUserId(user.id);
    setTempData({ activeShop: user.activeShop, activeFarm: user.activeFarm });
  };

  const handleSave = (id: number) => {
    setUsers(users.map(user => user.id === id ? { ...user, ...tempData } : user));
    setEditUserId(null);
  };

  const handleCancel = () => setEditUserId(null);

  const handleSort = (key: keyof User) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const filteredUsers = users.filter(user => {
    // ถ้า searchTerm เป็นตัวเลข => เช็ค id ด้วย
    if (!isNaN(Number(searchTerm))) {
      return user.id === Number(searchTerm) || user.username.toLowerCase().includes(searchTerm.toLowerCase());
    }
    // ถ้าเป็น text => เช็คเฉพาะ username
    return user.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // แก้ตรงนี้ให้ sort id, boolean แยกชัดเจน
  const sortedUsers = filteredUsers.sort((a, b) => {
    const { key, direction } = sortConfig;

    // Sort Number (id)
    if (key === 'id') {
      return direction === 'asc' ? a.id - b.id : b.id - a.id;
    }

    // Sort Boolean (activeShop, activeFarm)
    if (typeof a[key] === 'boolean' && typeof b[key] === 'boolean') {
      return direction === 'asc'
        ? Number(b[key]) - Number(a[key])
        : Number(a[key]) - Number(b[key]);
    }

    // Sort String
    const valA = String(a[key]).toLowerCase();
    const valB = String(b[key]).toLowerCase();
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="relative">
      {/* Fixed Page Header */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 p-4 shadow flex items-center">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">Back</Button>
        <h1 className="text-xl font-bold">User Management</h1>
      </div>

      {/* Add padding to prevent overlap */}
      <div className="pt-28 p-6">
        {/* Search Box */}
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Search by userid or username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-1/3"
          />
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[70vh] border rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th
                  className="p-2 border sticky top-0 bg-gray-200 z-40 cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  User Id {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className="p-2 border sticky top-0 bg-gray-200 z-40 cursor-pointer"
                  onClick={() => handleSort('username')}
                >
                  Username {sortConfig.key === 'username' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className="p-2 border sticky top-0 bg-gray-200 z-40 cursor-pointer"
                  onClick={() => handleSort('role')}
                >
                  Role {sortConfig.key === 'role' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className="p-2 border sticky top-0 bg-gray-200 z-40 cursor-pointer"
                  onClick={() => handleSort('lastUpdated')}
                >
                  Last Updated {sortConfig.key === 'lastUpdated' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className="p-2 border sticky top-0 bg-gray-200 z-40 cursor-pointer"
                  onClick={() => handleSort('activeShop')}
                >
                  Active Shop {sortConfig.key === 'activeShop' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className="p-2 border sticky top-0 bg-gray-200 z-40 cursor-pointer"
                  onClick={() => handleSort('activeFarm')}
                >
                  Active Farm {sortConfig.key === 'activeFarm' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="p-2 border">{user.id}</td>
                  <td className="p-2 border">{user.username}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border text-center">{user.lastUpdated}</td>
                  <td className="p-2 border text-center">
                    {editUserId === user.id ? (
                      <Checkbox
                        checked={tempData.activeShop}
                        onCheckedChange={(checked) => setTempData(prev => ({ ...prev, activeShop: !!checked }))}
                      />
                    ) : (
                      <Checkbox checked={user.activeShop} disabled />
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    {editUserId === user.id ? (
                      <Checkbox
                        checked={tempData.activeFarm}
                        onCheckedChange={(checked) => setTempData(prev => ({ ...prev, activeFarm: !!checked }))}
                      />
                    ) : (
                      <Checkbox checked={user.activeFarm} disabled />
                    )}
                  </td>
                  <td className="p-2 border text-center">
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
