"use client";
import { useState } from 'react';
import { Edit, Package, User, Store } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Default image for profile
const DEFAULT_PROFILE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23f3f4f6'/%3E%3Cpath d='M48 48C54.6274 48 60 42.6274 60 36C60 29.3726 54.6274 24 48 24C41.3726 24 36 29.3726 36 36C36 42.6274 41.3726 48 48 48ZM48 52C40.0474 52 33.5 58.5474 33.5 66.5H62.5C62.5 58.5474 55.9526 52 48 52Z' fill='%239ca3af'/%3E%3C/svg%3E";

interface FarmData {
  username: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  streetName: string;
  building: string;
  houseNo: string;
  description: string;
}

export default function Farm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [farmData, setFarmData] = useState<FarmData>({
    username: 'Username',
    firstname: 'John',
    lastname: 'Doe',
    phoneNumber: '0891234567',
    province: 'กรุงเทพมหานคร',
    district: 'วัฒนา',
    subDistrict: 'คลองตันเหนือ',
    postalCode: '10110',
    streetName: 'สุขุมวิท',
    building: 'อาคาร A',
    houseNo: '123/45',
    description: 'ฟาร์มของเรามีการปลูกผักออแกนิคที่ได้มาตรฐาน...'
  });

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast("บันทึกข้อมูลเรียบร้อยแล้ว");
      setShowEditDialog(false);
    } catch (error) {
      toast("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast("บันทึกที่อยู่เรียบร้อยแล้ว");
      setShowAddressDialog(false);
    } catch (error) {
      toast("เกิดข้อผิดพลาดในการบันทึกที่อยู่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <Navbar />

      {/* Profile Section */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 relative">
              <Image
                src={DEFAULT_PROFILE}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{farmData.username}</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <Link href="/farm/profile">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center p-4">
                  <User className="w-8 h-8 mb-2" />
                  <span className="text-sm">My Profile</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/farm/to-ship">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center p-4">
                  <Package className="w-8 h-8 mb-2" />
                  <span className="text-sm">To Ship</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/farm/sell-ingredient">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center p-4">
                  <Store className="w-8 h-8 mb-2" />
                  <span className="text-sm">Sell Ingredient</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Farm Address */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Farm Address</h2>
            <Button 
              variant="outline"
              onClick={() => setShowAddressDialog(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Address
            </Button>
          </div>

          <div className="space-y-2">
            <p className="font-medium">{farmData.firstname} {farmData.lastname}</p>
            <p>{farmData.phoneNumber}</p>
            <p>{farmData.building} {farmData.houseNo}</p>
            <p>{farmData.streetName} {farmData.subDistrict}</p>
            <p>{farmData.district} {farmData.province} {farmData.postalCode}</p>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="mt-6 mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-600">{farmData.description}</p>
        </CardContent>
      </Card>

{/* Edit Profile Dialog */}
<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
    </DialogHeader>
    
    <form onSubmit={handleSaveProfile}>
      <div className="space-y-4">
        {/* ... other form fields ... */}
      </div>
      
      <div className="mt-6 flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowEditDialog(false)}
          disabled={isLoading}
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              กำลังบันทึก...
            </div>
          ) : (
            'บันทึก'
          )}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

{/* Edit Address Dialog */}
<Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Farm Address</DialogTitle>
    </DialogHeader>
    
    <form onSubmit={handleSaveAddress}>
      <div className="grid grid-cols-2 gap-4">
        {/* ... form fields ... */}
      </div>
      
      <div className="mt-6 flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAddressDialog(false)}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[100px] bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              กำลังบันทึก...
            </div>
          ) : (
            'บันทึก'
          )}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
    </div>
  );
}