'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import axios from 'axios';

type Position = { position_name: string };

type User = {
  user_id: number;
  username: string;
  updated_at: string;
  positions: Position[];
  shop: { is_activate: boolean } | null;
  farm: { is_activate: boolean } | null;
};

export default function UserManagement() {
  const csrf = localStorage.getItem('csrfToken');
  const token = localStorage.getItem('token');

  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editedActivation, setEditedActivation] = useState<{ shop: number; farm: number }>({
    shop: 0,  // 0 represents false
    farm: 0,  // 0 represents false
  });

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setUsers(response.data.data);
      }
    } catch (error) {
      alert('Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Only fetch once on component mount

  // Edit user to enable modification
  const handleEditUser = (user: User) => {
    setEditUserId(user.user_id);
    setEditedActivation({
      shop: user.shop?.is_activate ? 1 : 0,  // Convert boolean to 1 (true) or 0 (false)
      farm: user.farm?.is_activate ? 1 : 0,  // Convert boolean to 1 (true) or 0 (false)
    });
  };

  // Toggle the checkbox values (change to 1 or 0)
  const handleCheckboxChange = (field: 'shop' | 'farm') => {
    setEditedActivation((prev) => ({
      ...prev,
      [field]: prev[field] === 1 ? 0 : 1, // Toggle between 1 (true) and 0 (false)
    }));
  };

  // Save the edited user data
  const handleSaveUser = async (userId: number) => {
    try {
      // ดึง CSRF Token ใหม่
      const csrfToken = await (async function fetchCsrfToken() {
        try {
          const response = await axios.get(`http://localhost:8000/csrf-token`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data.csrfToken;
        } catch (error) {
          console.error("Error fetching CSRF token:", error);
          alert("Failed to fetch CSRF token");
          return null;
        }
      })();
      if (!csrfToken) return;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/updateActivation`,
        {
          shop_is_activate: editedActivation.shop,
          farm_is_activate: editedActivation.farm,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken,
          },
        }
      );

      if (response.status === 200) {
        alert('Updated successfully');
        setEditUserId(null);
        fetchUsers(); // Refetch users after update
      } else {
        alert('Failed to update user');
      }
    } catch (error: any) {
      console.error("Error updating user:", error.response?.data || error.message);
      alert(error.response?.data?.message || "An error occurred while updating the user");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">User Management</h1>

      <table className="w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">User Id</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Position</th>
            <th className="p-2 border">Last Updated</th>
            <th className="p-2 border">Shop Status</th>
            <th className="p-2 border">Farm Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="border-t">
              <td className="p-2 border">{user.user_id}</td>
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">{user.positions.map((pos) => pos.position_name).join(', ')}</td>
              <td className="p-2 border">{user.updated_at}</td>

              {/* Shop Status */}
              <td className="p-2 border">
                {editUserId === user.user_id ? (
                  <Checkbox
                    checked={editedActivation.shop === 1} // If 1, checked; if 0, unchecked
                    onCheckedChange={() => handleCheckboxChange('shop')}
                  />
                ) : (
                  <Checkbox checked={user.shop?.is_activate ?? false} disabled />
                )}
              </td>

              {/* Farm Status */}
              <td className="p-2 border">
                {editUserId === user.user_id ? (
                  <Checkbox
                    checked={editedActivation.farm === 1} // If 1, checked; if 0, unchecked
                    onCheckedChange={() => handleCheckboxChange('farm')}
                  />
                ) : (
                  <Checkbox checked={user.farm?.is_activate ?? false} disabled />
                )}
              </td>

              {/* Action Buttons */}
              <td className="p-2 border flex gap-2">
                {editUserId === user.user_id ? (
                  <>
                    <Button onClick={() => handleSaveUser(user.user_id)}>
                      <Save size={16} />
                    </Button>
                    <Button variant="destructive" onClick={() => setEditUserId(null)}>
                      <X size={16} />
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleEditUser(user)}>
                    <Pencil size={16} />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
