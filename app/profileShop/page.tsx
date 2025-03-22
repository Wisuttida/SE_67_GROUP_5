"use client";

import Navbar from '@/components/Navbar';
import SideBarShop from '@/components/SideBarShop';
import { useState, useEffect } from 'react';

interface AddressInfo {
  ชื่อ: string;
  นามสกุล: string;
  เบอร์: string;
  บ้านเลขที่: string;
  ถนน: string;
  ตำบล: string;
  อำเภอ: string;
  จังหวัด: string;
  รหัสไปรษณีย์: string;
}

interface BankInfo {
  ธนาคาร: string;
  เลขบัญชี: string;
  ชื่อ: string;
}

const ProfileShop = () => {
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  // เก็บค่าก่อนแก้ไข
  const [tempAddressInfo, setTempAddressInfo] = useState<AddressInfo | null>(null);
  const [tempDescription, setTempDescription] = useState('');
  const [tempBankInfo, setTempBankInfo] = useState<BankInfo | null>(null);

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    ชื่อ: '',
    นามสกุล: '',
    เบอร์: '',
    บ้านเลขที่: '',
    ถนน: '',
    ตำบล: '',
    อำเภอ: '',
    จังหวัด: '',
    รหัสไปรษณีย์: '',
  });

  const [description, setDescription] = useState('');
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    ธนาคาร: '',
    เลขบัญชี: '',
    ชื่อ: '',
  });

  // เปิดโหมดแก้ไขและเก็บค่าก่อนหน้า
   const handleEditAddress = () => {
    setTempAddressInfo({ ...addressInfo });
    setIsAddressEditing(true);
  };

  const handleEditDescription = () => {
    setTempDescription(description);
    setIsDescriptionEditing(true);
  };

  const handleEditBankInfo = () => {
    setTempBankInfo({ ...bankInfo });
    setIsEditing(true);
  };

  // ยกเลิกการแก้ไข (คืนค่ากลับ)
  const handleCancelAddressEdit = () => {
    if (tempAddressInfo) {
      setAddressInfo(tempAddressInfo);
    }
    setIsAddressEditing(false);
  };

  const handleCancelDescriptionEdit = () => {
    setDescription(tempDescription);
    setIsDescriptionEditing(false);
  };

  const handleCancelBankEdit = () => {
    if (tempBankInfo) {
      setBankInfo(tempBankInfo); // คืนค่าที่แก้ไขกลับไป
    }
    setIsEditing(false); // ปิดโหมดแก้ไข
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSave = () => {
    console.log('Address Saved:', addressInfo);
    setIsAddressEditing(false);
  };

  interface ShopData {
    shop_id: number;
    shop_name: string;
    shop_image: string | null;
    description: string | null;
    accepts_custom: number;
    bank_name: string;
    bank_account: string;
    bank_number: string;
    addresses_address_id: string | null;
  }
  const [shop_data, setShopData] = useState<ShopData | undefined>(undefined);
  useEffect(() => {
    const shop_dataGet = localStorage.getItem('shop');
    if (shop_dataGet) {
      try {
        const data: ShopData = JSON.parse(shop_dataGet);
        setShopData(data);
        setBankInfo(prevState => ({
          ...prevState,
          ธนาคาร: data.bank_name,
          เลขบัญชี: data.bank_number,
          ชื่อ: data.bank_account,
        }));
        if (data.description) {
          setDescription(data.description);
        } else {
          setDescription(''); // Set to an empty string or any default value you prefer
        }
      } catch (error) {
        console.error('Error parsing shop data from localStorage:', error);
      }
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* เริ่มต้น Flexbox Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-300 text-white p-6">
          <SideBarShop />
        </div>

        {/* Content */}
        <div className="flex-1 max-w-screen-xl mx-auto px-4 py-6">
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
            <button onClick={handleEditAddress} className="text-blue-500 mt-4">✏️ แก้ไขที่อยู่</button>
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
                  <button onClick={handleCancelAddressEdit} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
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
                  <button onClick={handleCancelDescriptionEdit} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
                  <button onClick={handleDescriptionSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">บันทึก</button>
                </div>
              </div>
            ) : (
              <p>{description || 'ไม่มีคำอธิบาย'}</p>
            )}
            {!isDescriptionEditing && (
              <button onClick={handleEditDescription} className="text-blue-500 mt-4">✏️ แก้ไขคำอธิบาย</button>
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
                  <button onClick={handleCancelBankEdit} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
                  <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">บันทึก</button>
                </div>
              </div>
            ) : (
              <div>
                {Object.entries(bankInfo).map(([key, value]) => (
                  <p key={key}>{key.replace(/([A-Z])/g, ' $1')}: {value || '-'}</p>
                ))}
                <button onClick={handleEditBankInfo} className="text-blue-500 mt-4">✏️ แก้ไขข้อมูลบัญชีธนาคาร</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileShop;
