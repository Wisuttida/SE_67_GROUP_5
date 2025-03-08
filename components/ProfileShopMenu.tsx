"use client";

import { useState } from "react";
import { Edit, Store, Truck, User, ClipboardList, Droplets, Inbox, Check, Package, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    { name: "User Profile", icon: <User size={32} />, path: "/ProfileUser" },
    { name: "My Shop", icon: <Store size={32} />, path: "/profileShop" },
    { name: "My Product", icon: <Package size={32} />, path: "/myProductShop" },
    { name: "Order", icon: <ClipboardList size={32} />, path: "/shopOrder" },
    { name: "Add Product", icon: <Plus size={32} />, path: "/addProduct" },
    { name: "Buy Ingredient", icon: <Droplets size={32} />, path: "/profileShop" },
    { name: "To Ship", icon: <Truck size={32} />, path: "/shopToShip" },
    { name: "To Receive", icon: <Inbox size={32} />, path: "/profileShop" },
  ];

  const handleImageChange = (event) => {
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

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <Card className="mt-6 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-center">
            <div className="relative flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 shadow-md border">
                <Image src={profileImage} alt="Profile" width={96} height={96} className="object-cover" />
              </div>
              <h2 className="text-lg font-semibold mt-4">{username}</h2>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 flex items-center gap-1 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" /> Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 md:ml-10 w-full">
              {menuItems.map((item, index) => (
                <Link href={item.path} key={index}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex flex-col items-center p-4">
                      <div className="w-12 h-12 flex items-center justify-center">{item.icon}</div>
                      <p className="text-sm mt-2">{item.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              className="border rounded-md px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="outline" size="sm" onClick={handleSaveProfile} className="flex items-center gap-1 w-full">
              <Check className="w-4 h-4" /> Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}