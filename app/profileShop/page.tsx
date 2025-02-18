import React from 'react'
import Navbar from '@/components/Navbar'

import { User, Package, Settings, Plus, Droplets, Truck, ClipboardList } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const profileShop = () => {
    const menuItems = [
        { name: "My Profile", icon: <User size={32} />, },
        { name: "My Product", icon: <Package size={32} />, path: "/shopToShip" },
        { name: "Order Customize", icon: <Settings size={32} />, path: "/shopToShip" },
        { name: "Add Product", icon: <Plus size={32} />, path: "/shopToShip" },
        { name: "Buy Ingredient", icon: <Droplets size={32} /> },
        { name: "To Ship", icon: <Truck size={32} />, path: "/shopToShip"},
        { name: "To Receive", icon: <ClipboardList size={32} />, path: "/shopToShip" },
      ];
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
      {/* Profile Section */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between">
        <div className="flex items-center space-x-4">
            <div >
                <div className="w-16 h-16 border-2 border-gray-300 rounded-full overflow-hidden">
                    <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png" // เปลี่ยนเป็น URL รูปจริง
                    alt="Profile"
                    className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex items-center">
                    <input type="checkbox" className="toggle-checkbox" />
                    <label className="mr-2">Accepting customize from customer</label>
                </div>
            </div>
            
            <div>
                <h2 className="text-lg font-semibold">Username</h2>
                <button className="text-blue-500">✏️ Edit Profile</button>
                    
            </div>
            </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4 bg-white p-4 rounded-lg shadow-md">
                {menuItems.map((item, index) => (
                    <Link key={index} href={item.path|| "#"} className='block'>
                    <div  className="flex flex-col items-center p-4 hover:bg-gray-200 rounded-lg cursor-pointer">
                        {item.icon}
                        <p className="mt-2 text-sm font-semibold"> {item.name} </p>
                    </div>
                    </Link>
                ))}
            </div>
        
      </div>

      

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
        <button className="text-blue-500 mt-2">✏️ Edit Address</button>
        
       
      </div>

      {/* Description Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-lg font-semibold">Description</h3>
        <textarea className="w-full p-2 border rounded-lg mt-2" placeholder="Text"></textarea>
      </div>
    </div>

      

    </div>
  )
}

export default profileShop