"use client";

import React, { useState } from "react";
import { User, Package, Settings, Plus, Droplets, Truck, ClipboardList } from "lucide-react";
import Link from "next/link";

const ProfileShopMenu = () => {
  const [profile, setProfile] = useState({
    username: "John Doe",
    profileImage: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    coverImage: "", // เพิ่มฟิลด์รูปภาพปก
    acceptingCustomOrders: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  const menuItems = [
    { name: "User Profile", icon: <User size={32} />, path: "/ProfileUser" },
    { name: "My Shop", icon: <User size={32} />, path: "/profileShop" },
    { name: "My Product", icon: <Package size={32} />, path: "/myProductShop" },
    { name: "Order", icon: <Settings size={32} />, path: "/profileShop" },
    { name: "Add Product", icon: <Plus size={32} />, path: "/addProduct" },
    { name: "Buy Ingredient", icon: <Droplets size={32} />, path: "/profileShop" },
    { name: "To Ship", icon: <Truck size={32} />, path: "/shopToShip" },
    { name: "To Receive", icon: <ClipboardList size={32} />, path: "/profileShop" },
  ];

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, [type]: imageUrl }));
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* รูปภาพปกร้านค้า */}
      <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Upload Cover Image
          </div>
        )}
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "coverImage")}
            className="absolute top-2 left-2 bg-white p-1 text-sm"
          />
        )}
      </div>

      <div className="flex items-center space-x-4 mt-4">
        {/* รูปโปรไฟล์ */}
        <div>
          <div className="w-16 h-16 border-2 border-gray-300 rounded-full overflow-hidden">
            <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {isEditing && <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "profileImage")} />}
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="acceptingCustomOrders"
              checked={profile.acceptingCustomOrders}
              onChange={handleProfileChange}
              disabled={!isEditing}
            />
            <label className="ml-2">Accepting customize from customer</label>
          </div>
        </div>

        {/* ชื่อร้านค้า และปุ่มแก้ไข */}
        <div>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Shop Name"
            />
          ) : (
            <h2 className="text-lg font-semibold">{profile.username}</h2>
          )}
          <button className="text-blue-500 mt-2" onClick={() => setIsEditing((prev) => !prev)}>
            {isEditing ? "✅ Save Profile" : "✏️ Edit Profile"}
          </button>
        </div>
      </div>

      {/* เมนูต่างๆ */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4 bg-white p-4 rounded-lg shadow-md">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.path || "#"} className="block">
            <div className="flex flex-col items-center p-4 hover:bg-gray-200 rounded-lg cursor-pointer">
              {item.icon}
              <p className="mt-2 text-sm font-semibold"> {item.name} </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileShopMenu;
