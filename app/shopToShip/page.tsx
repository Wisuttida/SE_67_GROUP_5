"use client";
import { useState } from 'react';
import { Edit, Search, ShoppingCart, Bell, Home, Store, Tractor, Grid, Clipboard, DollarSign, Upload, Truck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";

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
  const [addresses, setAddresses] = useState<AddressData[]>([{
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
  }]);

  const profileMenuItems: ProfileMenuItem[] = [
    { icon: <Store className="w-6 h-6" />, label: "My Shop", href: "/shop" },
    { icon: <Tractor className="w-6 h-6" />, label: "My Farm", href: "/farm" },
    { icon: <Grid className="w-6 h-6" />, label: "Order Customize", href: "/customize" },
    { icon: <ShoppingCart className="w-6 h-6" />, label: "Cart", href: "/cart" },
    { icon: <Clipboard className="w-6 h-6" />, label: "Order", href: "/orders" },
    { icon: <DollarSign className="w-6 h-6" />, label: "To Pay", href: "/to-pay" },
    { icon: <Upload className="w-6 h-6" />, label: "To Ship", href: "/userToShip" },
    { icon: <Truck className="w-6 h-6" />, label: "To Receive", href: "/to-receive" }
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center py-4 border-b border-gray-300">
        <div className="text-xl font-bold">To Ship</div>
        <div className="flex gap-4">
          <Input placeholder="Search Product" className="w-64" />
          <Button variant="outline"><Search className="w-5 h-5" /></Button>
        </div>
        <div className="flex gap-4">
          <Link href="/profile" passHref>
            <Button variant="outline">Profile</Button>
          </Link>
          <Button variant="destructive">Log out</Button>
        </div>
      </div>
      <div className="flex justify-center py-4">
        <h2 className="text-2xl font-bold">To Ship</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="bg-white shadow-lg rounded-lg">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="flex items-center mb-4">
                <Image
                  src="/avatar.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full mr-4"
                />
                <p className="font-semibold">Shop1</p>
              </div>
              <Image
                src="/product.png"
                alt="Product Image"
                width={80}
                height={80}
                className="mb-4"
              />
              <div className="text-center">
                <p className="font-medium">Product Name</p>
                <p className="text-gray-600">Description</p>
                <p className="text-gray-600">Amount</p>
                <p className="text-gray-600">Total Price</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
