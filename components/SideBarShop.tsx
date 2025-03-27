"use client";

import { useState, useEffect } from "react";
import { Edit, Store, Truck, User, ClipboardList, UserRoundSearch , Inbox, Check,  Boxes, Plus, X, PackageOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from 'axios';
import Image from "next/image";

const DEFAULT_PROFILE_IMAGE = "/default-profile.png"; // รูปโปรไฟล์เริ่มต้น

export default function ProfileUser() {
  let csrf = localStorage.getItem('csrfToken');
  let token = localStorage.getItem('token');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempProfileImage, setTempProfileImage] = useState(profileImage);
  const [isChecked, setIsChecked] = useState(false);
  const [tempIsChecked, setTempIsChecked] = useState(isChecked);

  const menuItems = [
    { name: "Profile", icon: <User size={32} />, path: "/ProfileUser" },
    { name: "My Shop", icon: <Store size={32} />, path: "/profileShop" },
    { name: "My Product", icon: < Boxes size={32} />, path: "/myProductShop" },
    { name: "Order", icon: <ClipboardList size={32} />, path: "/shopOrder" },
    { name: "Add Product", icon: <Plus size={32} />, path: "/addProduct" },
    { name: "Post Ingredient", icon: <PackageOpen  size={32} />, path: "/shopPost" },
    { name: "Buy Ingredient", icon: <UserRoundSearch  size={32} />, path: "/shopHomePost" },
    { name: "To Ship", icon: <Truck size={32} />, path: "/shopToShip" },
    { name: "To Recieve", icon: <Inbox size={32} />, path: "/shopToRecieve" },
  ];

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
  
      // ล้าง URL เก่าก่อนเพื่อป้องกัน memory leak
      if (tempProfileImage) {
        URL.revokeObjectURL(tempProfileImage);
      }
  
      // สร้าง URL ใหม่และเก็บไว้
      const imageUrl = URL.createObjectURL(file);
      setTempProfileImage(imageUrl);
      localStorage.setItem("profileImage", imageUrl);
    }
  };
  

  const handleSaveProfile = () => {
    const updatedShopData = {
      ...shop_data,
      shop_name: tempUsername,
      shop_image: tempProfileImage,
      accepts_custom: isChecked,
    };
  
    // อัปเดต State
    //setShopData(updatedShopData.shop_name); 
    
    // อัปเดต LocalStorage
    localStorage.setItem('shop', JSON.stringify(updatedShopData)); 
    setUsername(tempUsername); // อัปเดต username หลัก
    setProfileImage(tempProfileImage);
    setIsChecked(isChecked);
    setIsEditing(false);
    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/shop/updateProfile`,
      {
        shop_name : updatedShopData.shop_name,
        shop_image : tempProfileImage,
        accepts_custom : isChecked
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrf,
        },
        withCredentials: true,
      }
    ).catch(error => {
      console.error('Error saving profile:', error.response ? error.response.data : error.message);
    });
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shop/get`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrf,
      },
      withCredentials: true,
    })
    .then(res => {
      const updatedShop = res.data.data.shop[0];
      localStorage.setItem('shop', JSON.stringify(res.data.data.shop[0]));
      setShopData(updatedShop); // อัปเดตข้อมูล shop_data หลังเซฟ
      setUsername(updatedShop.shop_name); // อัปเดต username หลัก
    })
    .catch(error => {
      console.error("Error fetching address:", error);
    });
  };

  const handleCancelEdit = () => {
    setTempUsername(username); // รีเซ็ตค่า username ชั่วคราว
    setTempProfileImage(profileImage); // รีเซ็ตค่าโปรไฟล์
    setIsEditing(false); // ปิดโหมดการแก้ไข
    setTempIsChecked(isChecked);
  };
  interface ShopData {
    shop_id: number;
    shop_name: string;
    shop_image: string | null;
    description: string | null;
    accepts_custom: boolean;
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
        setIsChecked(data.accepts_custom);
        setUsername(data.shop_name);
        setTempUsername(data.shop_name); // ตั้งค่า username ชั่วคราวสำหรับ input
      } catch (error) {
        console.error('Error parsing shop data from localStorage:', error);
      }
    }
  }, []);
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);


  return (
    <aside className="w-64 bg-white shadow-md rounded-lg p-6 h-full"> {/* เปลี่ยนที่นี่ */}
      {/* Sidebar */}
      <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-3">
          <Image 
            src={profileImage} 
            alt="Profile" 
            width={80}
            height={80}
            className="object-cover"
            />
        </div>
          <h3 className="font-medium text-gray-800">{shop_data?.shop_name}</h3>
          <div className="mt-2 flex items-center justify-center gap-2">
            <input type="checkbox" checked={isChecked} disabled className="hidden" />
            <div className={`w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center ${isChecked ? 'bg-blue-500 border-blue-500' : ''}`}>
              {shop_data?.accepts_custom && isChecked ? <Check className="w-4 h-4 text-white" /> : null}
            </div>
            <span className="text-sm text-gray-700">รับคำสั่งซื้อ Custom</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 flex items-center gap-1 text-black bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full transition"
            onClick={() => setIsEditing(true)}
            >
            <Edit className="w-4 h-4" /> Edit Profile
          </Button>
        
      </div>
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <Link href={item.path} key={index}>
              <Button 
              variant="ghost" 
              className="w-full justify-start flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <span className="text-gray-500">{item.icon}</span> 
              <span>{item.name}</span>
            </Button>
            </Link>
          ))}
        </nav>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Profile</h3>
                <button onClick={() => setIsEditing(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 shadow-md border mb-4">
                  <Image src={tempProfileImage} alt="Temp Profile" width={96} height={96} className="object-cover" />
                </div>
                <label className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full cursor-pointer transition">
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>

              {/* Label และ input สำหรับ Username */}
              <div className="w-full mb-4">
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={tempUsername} // ใช้ tempUsername แทน
                  onChange={(e) => setTempUsername(e.target.value)} // อัปเดต tempUsername
                  className="border rounded-md px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <div className="w-full mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shop_data?.accepts_custom}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="hidden"
                />
                <div className={`w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center ${isChecked ? 'bg-blue-500 border-blue-500' : ''}`}
                onClick={() => setIsChecked(!isChecked)}>
                  {isChecked && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm text-gray-700">รับคำสั่งซื้อ Custom</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 w-full text-black bg-gray-200 hover:bg-gray-300"
                >
                  <X className="w-4 h-4" /> Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1 w-full text-black bg-gray-300 hover:bg-gray-400"
                >
                  <Check className="w-4 h-4" /> Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      </aside>
  );
}
