'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2 } from 'lucide-react';

// ประกาศ Type
type Position = {
  position_name: string;
};

type User = {
  user_id: number;
  username: string;
  updated_at: string;
  positions: Position[]; // เพิ่มการรับข้อมูล positions ที่เป็น array
  shop: {
    is_activate: boolean;
  } | null;
  farm: {
    is_activate: boolean;
  } | null;
};

type SortConfig = {
  key: keyof User;
  direction: 'asc' | 'desc';
};

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'username', direction: 'asc' });
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    position: 4 // Default to 'Customer' position
  });

  const [userActivation, setUserActivation] = useState<{ [userId: number]: { shop: boolean; farm: boolean } }>({});

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated');
        return;
      }

      const response = await fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setUsers(data.data);
      }
    } catch (error) {
      alert('Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (key: keyof User) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const filteredUsers = users.filter(user => {
    if (!isNaN(Number(searchTerm))) {
      return user.user_id === Number(searchTerm) || user.username.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return user.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedUsers = filteredUsers.sort((a, b) => {
    const { key, direction } = sortConfig;

    if (key === 'user_id') {
      return direction === 'asc' ? a.user_id - b.user_id : b.user_id - a.user_id;
    }

    const valA = String(a[key]).toLowerCase();
    const valB = String(b[key]).toLowerCase();
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleEditClick = (userId: number) => {
    setEditUserId(userId);
    setUserActivation({
      ...userActivation,
      [userId]: {
        shop: users.find(user => user.user_id === userId)?.shop?.is_activate ?? false,
        farm: users.find(user => user.user_id === userId)?.farm?.is_activate ?? false,
      },
    });
  };

  const handleActivationChange = async (userId: number, shopActivate: boolean, farmActivate: boolean) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/users/${userId}/updateActivation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        shop_is_activate: shopActivate,
        farm_is_activate: farmActivate,
      }),
    });

    const data = await response.json();
    if (data.status === 'success') {
      alert('Activation status updated successfully');
      fetchUsers();
    }
  };

  const handleCreateUser = async () => {
    try {
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated');
        return;
      }

      const response = await fetch('http://localhost:8000/api/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('User created successfully');
        setUsers([...users, data.data]);
        setIsCreateUserOpen(false);
      }
    } catch (error) {
      alert('Error creating user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      alert('Error deleting user');
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full bg-white z-50 p-4 shadow flex items-center">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">Back</Button>
        <h1 className="text-xl font-bold">User Management</h1>
      </div>

      <div className="pt-28 p-6">
        <Button variant="outline" onClick={() => setIsCreateUserOpen(true)} className="mb-4">
          Create User
        </Button>

        {isCreateUserOpen && (
          <div className="p-4 border rounded mb-6">
            <h3>Create User</h3>
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="First Name"
              value={newUser.first_name}
              onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newUser.last_name}
              onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newUser.phone_number}
              onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <div className="mt-4">
              <Button variant="ghost" onClick={handleCreateUser}>Create</Button>
              <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-28 p-6">
        <input
          type="text"
          placeholder="Search by userid or username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-1/3"
        />

        <div className="overflow-auto max-h-[70vh] border rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40 cursor-pointer" onClick={() => handleSort('user_id')}>User Id</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40 cursor-pointer" onClick={() => handleSort('username')}>Username</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40 cursor-pointer">Position</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40 cursor-pointer" onClick={() => handleSort('updated_at')}>Last Updated</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40">Shop Status</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40">Farm Status</th>
                <th className="p-2 border sticky top-0 bg-gray-200 z-40">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(user => (
                <tr key={user.user_id} className="border-t">
                  <td className="p-2 border">{user.user_id}</td>
                  <td className="p-2 border">{user.username}</td>
                  <td className="p-2 border">
                    {user.positions.map((position, index) => (
                      <span key={index}>{position.position_name}{index < user.positions.length - 1 ? ', ' : ''}</span>
                    ))}
                  </td>
                  <td className="p-2 border text-center">{user.updated_at}</td>
                  <td className="p-2 border text-center">
                    {user.shop ? (
                      <Checkbox checked={user.shop.is_activate} disabled />
                    ) : (
                      <Checkbox disabled />
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    {user.farm ? (
                      <Checkbox checked={user.farm.is_activate} disabled />
                    ) : (
                      <Checkbox disabled />
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditClick(user.user_id)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteUser(user.user_id)}>
                      <Trash2 size={16} />
                    </Button>
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
