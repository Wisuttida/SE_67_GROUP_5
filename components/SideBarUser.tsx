"use client";

import { Store, Tractor, Grid, ShoppingCart, Clipboard, DollarSign, Upload, Truck, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';

const DEFAULT_PROFILE_IMAGE = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

interface UserData {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_image: string | null;
}

export default function SideBarUser() {
  const [hasShop, setHasShop] = useState(false);
  const [hasFarm, setHasFarm] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    user_id: 0,
    username: 'User',
    email: 'user@example.com',
    first_name: '',
    last_name: '',
    phone_number: '',
    profile_image: null,
  });

  useEffect(() => {
    const userDataGet = localStorage.getItem('user_data');
    if (userDataGet) {
      try {
        const data: UserData = JSON.parse(userDataGet);
        setUserData(data);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
    const shopGet = localStorage.getItem('shop');
    if (shopGet && shopGet !== 'undefined') {
      const shop = JSON.parse(shopGet);
      if (shop.shop_id) {
        setHasShop(true);
      }
    }
    const farmGet = localStorage.getItem('farm');
    if (farmGet && farmGet !== 'undefined') {
      const farm = JSON.parse(farmGet);
      if (farm.farm_id) {
        setHasFarm(true);
      }
    }
  }, []);

  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: "Profile", href: "/ProfileUser" },
    { icon: <Store className="w-5 h-5" />, label: "My Shop", href: "/profileShop" },
    { icon: <Tractor className="w-5 h-5" />, label: "My Farm", href: "/farm" },
    { icon: <Grid className="w-5 h-5" />, label: "Order Customize", href: "/ProfileUser/customize-order" },
    { icon: <ShoppingCart className="w-5 h-5" />, label: "Cart", href: "/cart" },
    { icon: <Clipboard className="w-5 h-5" />, label: "Order", href: "/userOrder" },
    { icon: <DollarSign className="w-5 h-5" />, label: "To Pay", href: "/userToPay" },
    { icon: <Upload className="w-5 h-5" />, label: "To Ship", href: "/userToShip" },
    { icon: <Truck className="w-5 h-5" />, label: "To Receive", href: "/userToReceive" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md rounded-lg p-6 h-full">
      {/* User Profile Section */}
      <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
          <Image
            src={userData.profile_image || DEFAULT_PROFILE_IMAGE} 
            alt="Profile Image" 
            width={100}  // Add the width
            height={100} // Add the height
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-medium text-gray-800">{userData.username}</h3>
        <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
      </div>
      
      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map(({ icon, label, href }, index) => {
          if (label === "My Shop" && !hasShop) {
            return (
              <Link href="/registerShop" key={index}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <span className="text-gray-500">{icon}</span> 
                  <span>Register Shop</span>
                </Button>
              </Link>
            )
          }
          if (label === "My Farm" && !hasFarm) {
            return (
              <Link href="/registerFarm" key={index}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <span className="text-gray-500">{icon}</span> 
                  <span>Register Farm</span>
                </Button>
              </Link>
            )
          }
          return (
            <Link href={href} key={index}>
              <Button 
                variant="ghost" 
                className="w-full justify-start flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="text-gray-500">{icon}</span> 
                <span>{label}</span>
              </Button>
            </Link>
          )
          })}
      </nav>
    </aside>
  );
}
