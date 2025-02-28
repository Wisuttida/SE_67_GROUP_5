"use client";
import { useState } from 'react';
import { Edit, Search, ShoppingCart, Bell, Home, Store, Tractor, Grid, Clipboard, DollarSign, Upload, Truck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

interface AddressData {
  firstname: string;
  lastname: string;
  phone: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  streetName: string;
  building: string;
  houseNumber: string;
  isDefault?: boolean;
}

interface ProfileMenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function ProfileUser() {
  const [addresses, setAddresses] = useState<AddressData[]>([
    {
      firstname: 'John',
      lastname: 'Doe',
      phone: '092-123-4567',
      province: 'Bangkok',
      district: 'Watthana',
      subDistrict: 'Khlong Toei Nuea',
      postalCode: '10110',
      streetName: 'Sukhumvit Road',
      building: 'ABC Building',
      houseNumber: '123/45',
      isDefault: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const profileMenuItems: ProfileMenuItem[] = [
    { icon: <Store className="w-6 h-6" />, label: "My Shop", href: "/profileShop" },
    { icon: <Tractor className="w-6 h-6" />, label: "My Farm", href: "/farm" },
    { icon: <Grid className="w-6 h-6" />, label: "Order Customize", href: "/customize" },
    { icon: <ShoppingCart className="w-6 h-6" />, label: "Cart", href: "/cart" },
    { icon: <Clipboard className="w-6 h-6" />, label: "Order", href: "/orders" },
    { icon: <DollarSign className="w-6 h-6" />, label: "To Pay", href: "/to-pay" },
    { icon: <Upload className="w-6 h-6" />, label: "To Ship", href: "/userToShip" },
    { icon: <Truck className="w-6 h-6" />, label: "To Receive", href: "/to-receive" }
  ];

  const handleAddAddress = () => {
    // Implementation for adding a new address
    const newAddress: AddressData = {
      firstname: '',
      lastname: '',
      phone: '',
      province: '',
      district: '',
      subDistrict: '',
      postalCode: '',
      streetName: '',
      building: '',
      houseNumber: ''
    };
    setAddresses([...addresses, newAddress]);
  };

  const handleEditAddress = (index: number) => {
    // Implementation for editing an address
    console.log(`Editing address at index ${index}`);
  };

  const handleSetDefaultAddress = (index: number) => {
    const updatedAddresses = addresses.map((address, i) => ({
      ...address,
      isDefault: i === index
    }));
    setAddresses(updatedAddresses);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* Header with Navbar component */}
      <Navbar />

      {/* Profile Section */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 relative">
                <Image 
                  src="/profile-placeholder.png" 
                  alt="Profile" 
                  fill
                  sizes="(max-width: 96px) 96px"
                  className="object-cover"
                />
              </div>
              <p className="mt-2 font-medium">Username</p>
              <Button variant="ghost" size="sm" className="mt-2">
                <Edit className="w-4 h-4 mr-1" /> Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 md:mt-0 md:ml-8 w-full">
              {profileMenuItems.map((item, index) => (
                <Link href={item.href} key={index}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex flex-col items-center p-4">
                      <div className="w-12 h-12 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <p className="text-sm mt-2">{item.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Section */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Address</h2>
          </div>
          
          {addresses.map((address, index) => (
            <div key={index} className="bg-white rounded-lg border p-4 mb-4 relative">
              <div className="absolute right-4 top-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEditAddress(index)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit Address
                </Button>
              </div>
              <div className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  className="mr-4 h-4 w-4" 
                  checked={address.isDefault}
                  onChange={() => handleSetDefaultAddress(index)}
                />
                {address.isDefault && <span className="text-sm text-green-600">Default Address</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">{address.firstname}</p>
                  <p className="text-gray-600 mt-2">{address.province}</p>
                  <p className="text-gray-600 mt-2">{address.streetName}</p>
                </div>
                <div>
                  <p className="font-medium">{address.lastname}</p>
                  <p className="text-gray-600 mt-2">{address.district}</p>
                  <p className="text-gray-600 mt-2">{address.building}</p>
                </div>
                <div>
                  <p className="font-medium">{address.phone}</p>
                  <p className="text-gray-600 mt-2">{address.subDistrict}</p>
                  <p className="text-gray-600 mt-2">{address.houseNumber}</p>
                  <p className="text-gray-600 mt-2">{address.postalCode}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-10 h-10"
              onClick={handleAddAddress}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}