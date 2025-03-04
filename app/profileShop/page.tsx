"use client";
import Navbar from '@/components/Navbar';
import ProfileShopMenu from '@/components/ProfileShopMenu';
import { useState } from 'react';

const ProfileShop = () => {
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  // เก็บข้อมูลที่อยู่
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
    <div>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <ProfileShopMenu />

        {/* Shop Address Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold">ที่อยู่ร้าน</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            <div className="border-b pb-1">ชื่อจริง: {addressInfo.firstName || '-'}</div>
            <div className="border-b pb-1">นามสกุล: {addressInfo.lastName || '-'}</div>
            <div className="border-b pb-1">เบอร์โทรศัพท์: {addressInfo.phoneNumber || '-'}</div>
            <div className="border-b pb-1">บ้านเลขที่: {addressInfo.houseNumber || '-'}</div>
            <div className="border-b pb-1">แขวง/ตำบล: {addressInfo.subDistrict || '-'}</div>
            <div className="border-b pb-1">เขต/อำเภอ: {addressInfo.district || '-'}</div>
            <div className="border-b pb-1">จังหวัด: {addressInfo.province || '-'}</div>
            <div className="border-b pb-1">รหัสไปรษณีย์: {addressInfo.postalCode || '-'}</div>
          </div>
          <button onClick={() => setIsAddressEditing(true)} className="text-blue-500 mt-3 inline-block">✏️ แก้ไขที่อยู่</button>
        </div>

        {/* Address Edit Modal */}
        {isAddressEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">แก้ไขที่อยู่</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>ชื่อจริง</label>
                  <input name="firstName" className="border p-2 rounded w-full" value={addressInfo.firstName} onChange={handleAddressChange} />
                </div>
                <div>
                  <label>นามสกุล</label>
                  <input name="lastName" className="border p-2 rounded w-full" value={addressInfo.lastName} onChange={handleAddressChange} />
                </div>
                <div>
                  <label>เบอร์โทรศัพท์</label>
                  <input name="phoneNumber" className="border p-2 rounded w-full" value={addressInfo.phoneNumber} onChange={handleAddressChange} />
                </div>
                <div>
                  <label>จังหวัด</label>
                  <input name="province" className="border p-2 rounded w-full" value={addressInfo.province} onChange={handleAddressChange} />
                </div>
                <div>
                  <label>เขต/อำเภอ</label>
                  <input name="district" className="border p-2 rounded w-full" value={addressInfo.district} onChange={handleAddressChange} />
                </div>
                <div>
                  <label>แขวง/ตำบล</label>
                  <input name="subDistrict" className="border p-2 rounded w-full" value={addressInfo.subDistrict} onChange={handleAddressChange} />
                </div>
                <div>
                  <label>บ้านเลขที่</label>
                  <input name="houseNumber" className="border p-2 rounded w-full" value={addressInfo.houseNumber} onChange={handleAddressChange} />
                </div>
                <div>
                  <label>รหัสไปรษณีย์</label>
                  <input name="postalCode" className="border p-2 rounded w-full" value={addressInfo.postalCode} onChange={handleAddressChange} />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button onClick={() => setIsAddressEditing(false)} className="bg-gray-300 px-4 py-2 rounded">ยกเลิก</button>
                <button onClick={handleAddressSave} className="bg-blue-500 text-white px-4 py-2 rounded">บันทึก</button>
              </div>
            </div>
          </div>
        )}
        {/* Description Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold">คำอธิบายร้าน</h3>
          {isDescriptionEditing ? (
            <div>
              <textarea className="w-full p-2 border rounded-lg mt-2" placeholder="คำอธิบาย" value={description} onChange={(e) => setDescription(e.target.value)} />
              <div className="flex justify-end mt-2 gap-2">
                <button onClick={() => setIsDescriptionEditing(false)} className="bg-gray-300 px-4 py-2 rounded">ยกเลิก</button>
                <button onClick={handleDescriptionSave} className="bg-blue-500 text-white px-4 py-2 rounded">บันทึก</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mt-2">{description || 'ไม่มีคำอธิบาย'}</p>
              <button onClick={() => setIsDescriptionEditing(true)} className="text-blue-500 mt-2">✏️ แก้ไขคำอธิบาย</button>
            </div>
          )}
        </div>

        {/* Bank Account Information Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold">ข้อมูลบัญชีธนาคาร</h3>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1 text-sm font-medium">ชื่อธนาคาร</label>
                <input type="text" name="bankName" value={bankInfo.bankName} onChange={handleChange} className="p-2 border rounded-lg w-full" placeholder="ชื่อธนาคาร" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">หมายเลขบัญชี</label>
                <input type="text" name="accountNumber" value={bankInfo.accountNumber} onChange={handleChange} className="p-2 border rounded-lg w-full" placeholder="หมายเลขบัญชี" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">ชื่อบัญชี</label>
                <input type="text" name="accountName" value={bankInfo.accountName} onChange={handleChange} className="p-2 border rounded-lg w-full" placeholder="ชื่อบัญชี" />
              </div>
              <div className="flex justify-end col-span-2 mt-4 gap-2">
                <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded">ยกเลิก</button>
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">บันทึก</button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p>ชื่อธนาคาร: {bankInfo.bankName || '-'}</p>
              <p>หมายเลขบัญชี: {bankInfo.accountNumber || '-'}</p>
              <p>ชื่อบัญชี: {bankInfo.accountName || '-'}</p>
              <button onClick={() => setIsEditing(true)} className="mt-4 text-blue-500">✏️ แก้ไขข้อมูลบัญชีธนาคาร</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileShop;
