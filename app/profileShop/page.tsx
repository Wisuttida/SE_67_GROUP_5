"use client";

import Navbar from '@/components/Navbar';
import ProfileShopMenu from '@/components/ProfileShopMenu';
import { useState } from 'react';

const ProfileShop = () => {
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  const [addressInfo, setAddressInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    houseNumber: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
  });

  const [description, setDescription] = useState('');
  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Bank Info Saved:', bankInfo);
    setIsEditing(false);
  };

  const handleDescriptionSave = () => {
    console.log('Description Saved:', description);
    setIsDescriptionEditing(false);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSave = () => {
    console.log('Address Saved:', addressInfo);
    setIsAddressEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <ProfileShopMenu />

        {/* ที่อยู่ร้าน */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
          <h3 className="text-xl font-semibold mb-4">📍 ที่อยู่ร้าน</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(addressInfo).map(([key, value]) => (
              <div key={key} className="border-b pb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}: {value || '-'}
              </div>
            ))}
          </div>
          <button onClick={() => setIsAddressEditing(true)} className="text-blue-500 mt-4">✏️ แก้ไขที่อยู่</button>
        </div>

        {isAddressEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
              <h2 className="text-2xl font-semibold mb-6">แก้ไขที่อยู่</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(addressInfo).map(([key, value]) => (
                  <div key={key}>
                    <label className="block mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      name={key}
                      value={value}
                      onChange={handleAddressChange}
                      className="border p-2 rounded-lg w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button onClick={() => setIsAddressEditing(false)} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
                <button onClick={handleAddressSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">บันทึก</button>
              </div>
            </div>
          </div>
        )}

        {/* คำอธิบายร้าน */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
          <h3 className="text-xl font-semibold mb-4">📋 คำอธิบายร้าน</h3>
          {isDescriptionEditing ? (
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 border rounded-lg"
                placeholder="คำอธิบายร้าน"
              />
              <div className="flex justify-end mt-4 space-x-4">
                <button onClick={() => setIsDescriptionEditing(false)} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
                <button onClick={handleDescriptionSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">บันทึก</button>
              </div>
            </div>
          ) : (
            <p>{description || 'ไม่มีคำอธิบาย'}</p>
          )}
          {!isDescriptionEditing && (
            <button onClick={() => setIsDescriptionEditing(true)} className="text-blue-500 mt-4">✏️ แก้ไขคำอธิบาย</button>
          )}
        </div>

        {/* ข้อมูลบัญชีธนาคาร */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
          <h3 className="text-xl font-semibold mb-4">🏦 ข้อมูลบัญชีธนาคาร</h3>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(bankInfo).map(([key, value]) => (
                <div key={key}>
                  <label className="block mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="p-2 border rounded-lg w-full"
                    placeholder={key}
                  />
                </div>
              ))}
              <div className="flex justify-end mt-4 space-x-4">
                <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">บันทึก</button>
              </div>
            </div>
          ) : (
            <div>
              {Object.entries(bankInfo).map(([key, value]) => (
                <p key={key}>{key.replace(/([A-Z])/g, ' $1')}: {value || '-'}</p>
              ))}
              <button onClick={() => setIsEditing(true)} className="text-blue-500 mt-4">✏️ แก้ไขข้อมูลบัญชีธนาคาร</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileShop;