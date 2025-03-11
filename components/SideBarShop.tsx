"use client";

import { useState } from "react";
import { Edit, Store, Truck, User, ClipboardList, UserRoundSearch , Inbox, Check,  Boxes, Plus, X, PackageOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const DEFAULT_PROFILE_IMAGE = "/default-profile.png"; // รูปโปรไฟล์เริ่มต้น

export default function ProfileUser() {
  const [username, setUsername] = useState("Username");
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempProfileImage, setTempProfileImage] = useState(profileImage);

  const menuItems = [
    { name: "โปรไฟล์ผู้ใช้", icon: <User size={32} />, path: "/ProfileUser" },
    { name: "ร้านของฉัน", icon: <Store size={32} />, path: "/profileShop" },
    { name: "คลังสินค้า", icon: < Boxes size={32} />, path: "/myProductShop" },
    { name: "คำสั่งซื้อ", icon: <ClipboardList size={32} />, path: "/shopOrder" },
    { name: "เพิ่มสินค้า", icon: <Plus size={32} />, path: "/addProduct" },
    { name: "รับซื้อวัตถุดิบ", icon: <PackageOpen  size={32} />, path: "/shopPost" },
    { name: "ซื้อวัตถุดิบ", icon: <UserRoundSearch  size={32} />, path: "/profileShop" },
    { name: "การขนส่ง", icon: <Truck size={32} />, path: "/shopToShip" },
    { name: "ที่ต้องได้รับ", icon: <Inbox size={32} />, path: "/profileShop" },
  ];

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setTempProfileImage(imageUrl);
    }
  };

  const handleSaveProfile = () => {
    setUsername(tempUsername);
    setProfileImage(tempProfileImage);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempUsername(username); // รีเซ็ตค่า username ชั่วคราว
    setTempProfileImage(profileImage); // รีเซ็ตค่าโปรไฟล์
    setIsEditing(false); // ปิดโหมดการแก้ไข
  };

  return (
    <div className="flex min-h-screen bg-gray-300"> {/* เปลี่ยนที่นี่ */}
      {/* Sidebar */}
      <div className="w-64 bg-gray-300 text-black p-6"> {/* เปลี่ยนเป็น bg-gray-200 */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 shadow-md border">
            <Image src={profileImage} alt="Profile" width={96} height={96} className="object-cover" />
          </div>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold">{username}</h2>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 flex items-center gap-1 text-black bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full transition"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </Button>
        </div>
        <div className="flex flex-col space-y-4">
          {menuItems.map((item, index) => (
            <Link href={item.path} key={index}>
              <div className="flex items-center space-x-3 hover:bg-gray-300 p-2 rounded-lg cursor-pointer">
                {item.icon}
                <p className="whitespace-nowrap">{item.name}</p> {/* Prevent text wrapping */}
              </div>
            </Link>
          ))}
        </div>
      </div>

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
                  value={tempUsername} // ใช้ tempUsername ที่สามารถแก้ไขได้
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="border rounded-md px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-blue-500 text-black" // เพิ่ม text-black ที่นี่
                />

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
    </div>
  );
}
