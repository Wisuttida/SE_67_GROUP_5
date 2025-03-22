"use client";
import { Edit, Search, ShoppingCart, Bell, Store, Tractor, Grid, Clipboard, DollarSign, Upload, Truck, Trash2,Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useState } from 'react';

const DEFAULT_IMAGES = {
  profile: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23f3f4f6'/%3E%3Cpath d='M48 48C54.6274 48 60 42.6274 60 36C60 29.3726 54.6274 24 48 24C41.3726 24 36 29.3726 36 36C36 42.6274 41.3726 48 48 48ZM48 52C40.0474 52 33.5 58.5474 33.5 66.5H62.5C62.5 58.5474 55.9526 52 48 52Z' fill='%239ca3af'/%3E%3C/svg%3E"
};

interface ProfileMenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function ProfileAdmin() {

  const profileMenuItems: ProfileMenuItem[] = [
    { icon: <Wrench className="w-6 h-6" />, label: "User Management", href: "/userManagement" },
  ];


  return (
    <div>
      <Navbar />


      {/* Profile Section */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 relative">
                <Image 
                  src={DEFAULT_IMAGES.profile}
                  alt="Profile"
                  width={96}
                  height={96}
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

    </div>
  );
}