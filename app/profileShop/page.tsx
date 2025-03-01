"use client";
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import ProfileShopMenu from '@/components/ProfileShopMenu';
import { useState } from 'react';

const ProfileShop = () => {
  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Bank Info Saved:', bankInfo);
    setIsEditing(false);
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <ProfileShopMenu />

        {/* Shop Address Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold">Shop Address</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {[
              "ชื่อ",
              "นามสกุล",
              "หมายเลขโทรศัพท์",
              "บ้านเลขที่",
              "ตำบล",
              "อำเภอ",
              "จังหวัด",
              "รหัสไปรสณีย์",
            ].map((field, index) => (
              <div key={index} className="border-b pb-1"> {field} </div>
            ))}
          </div>
          <Link href="/shopEditAddress" className="text-blue-500 mt-3 inline-block">
            ✏️ Edit Address
          </Link>
        </div>

        {/* Description Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold">คำอธิบายร้าน</h3>
          <textarea
            className="w-full p-2 border rounded-lg mt-2"
            placeholder="Text"
          ></textarea>
        </div>

        {/* Bank Account Information Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold">ข้อมูลบัญชีธนาคาร</h3>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1 text-sm font-medium">ชื่อธนาคาร</label>
                <input
                  type="text"
                  name="bankName"
                  value={bankInfo.bankName}
                  onChange={handleChange}
                  className="p-2 border rounded-lg w-full"
                  placeholder="Bank Name"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">หมายเลขบัญชี</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankInfo.accountNumber}
                  onChange={handleChange}
                  className="p-2 border rounded-lg w-full"
                  placeholder="Account Number"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">ชื่อบัญชี</label>
                <input
                  type="text"
                  name="accountName"
                  value={bankInfo.accountName}
                  onChange={handleChange}
                  className="p-2 border rounded-lg w-full"
                  placeholder="Account Name"
                />
              </div>
              <button
                onClick={handleSave}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p>ชื่อธนาคาร: {bankInfo.bankName || '-'}</p>
              <p>หมายเลขบัญชี: {bankInfo.accountNumber || '-'}</p>
              <p>ชื่อบัญชี: {bankInfo.accountName || '-'}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 text-blue-500"
              >
                ✏️ Edit Bank Info
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileShop;
