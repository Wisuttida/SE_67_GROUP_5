"use client";

import React, { useState } from "react";
import { User, Store, Package, ClipboardList, Plus, Droplets, Truck, Inbox } from "lucide-react";
import Link from "next/link";

const ProfileShopMenu = () => {
  const [profile, setProfile] = useState({
    username: "John Doe",
    profileImage: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    coverImage: "",
    acceptingCustomOrders: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  const menuItems = [
    { name: "User Profile", icon: <User size={32} />, path: "/ProfileUser" },
    { name: "My Shop", icon: <Store size={32} />, path: "/profileShop" },
    { name: "My Product", icon: <Package size={32} />, path: "/myProductShop" },
    { name: "Order", icon: <ClipboardList size={32} />, path: "/profileShop" },
    { name: "Add Product", icon: <Plus size={32} />, path: "/addProduct" },
    { name: "Buy Ingredient", icon: <Droplets size={32} />, path: "/profileShop" },
    { name: "To Ship", icon: <Truck size={32} />, path: "/shopToShip" },
    { name: "To Receive", icon: <Inbox size={32} />, path: "/profileShop" },
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
    <div className="bg-gradient-to-br from-gray-100 to-white p-6 rounded-2xl shadow-lg">
      {/* รูปภาพปกร้านค้า */}
      <div className="relative w-full h-64 bg-gray-300 rounded-2xl overflow-hidden">
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
            className="absolute top-4 left-4 bg-white p-2 text-sm rounded-lg shadow-md"
          />
        )}
      </div>

      <div className="flex items-center space-x-6 mt-8">
        {/* รูปโปรไฟล์ */}
        <div>
          <div className="w-24 h-24 border-4 border-white rounded-full overflow-hidden shadow-lg">
            <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {isEditing && <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "profileImage")} />}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              name="acceptingCustomOrders"
              checked={profile.acceptingCustomOrders}
              onChange={handleProfileChange}
              disabled={!isEditing}
              className="mr-2"
            />
            <label className="text-gray-600">Accepting customize from customer</label>
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
              className="text-2xl font-semibold text-gray-800 bg-gray-100 p-2 rounded-lg shadow-inner"
              placeholder="Shop Name"
            />
          ) : (
            <h2 className="text-3xl font-bold text-gray-800">{profile.username}</h2>
          )}
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "✅ Save Profile" : "✏️ Edit Profile"}
          </button>
        </div>
      </div>

      {/* เมนูต่างๆ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.path || "#"} className="block">
            <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
              {item.icon}
              <p className="mt-3 text-gray-700 font-medium">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileShopMenu;
