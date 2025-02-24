"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ShopEditAddress = () => {
  const router = useRouter();
  const [address, setAddress] = useState({
    ชื่อ: '',
    นามสกุล: '',
    หมายเลขโทรศัพท์: '',
    บ้านเลขที่: '',
    ตำบล: '',
    อำเภอ: '',
    จังหวัด: '',
    รหัสไปรสณีย์: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved Address:', address);
    router.push('/'); // กลับไปหน้า Dashboard
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Edit Shop Address</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(address).map((field) => (
            <div key={field}>
              <label className="block mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                name={field}
                value={address[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          ))}
          <button type="submit" className="md:col-span-2 bg-blue-500 text-white py-2 px-4 rounded-lg">
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopEditAddress;
