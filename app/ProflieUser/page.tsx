"use client";
import { useState } from 'react';
import { Edit, Search, ShoppingCart, Bell, Home, Store, Tractor, Grid, Clipboard, DollarSign, Upload, Truck, Trash2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

interface AddressData {
  id: string;
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
      id: "addr-1",
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
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<AddressData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const profileMenuItems: ProfileMenuItem[] = [
    { icon: <Store className="w-6 h-6" />, label: "My Shop", href: "/profileShop" },
    { icon: <Tractor className="w-6 h-6" />, label: "My Farm", href: "/farm" },
    { icon: <Grid className="w-6 h-6" />, label: "Order Customize", href: "/customize" },
    { icon: <ShoppingCart className="w-6 h-6" />, label: "Cart", href: "/cart" },
    { icon: <Clipboard className="w-6 h-6" />, label: "Order", href: "/userOrder" },
    { icon: <DollarSign className="w-6 h-6" />, label: "To Pay", href: "/to-pay" },
    { icon: <Upload className="w-6 h-6" />, label: "To Ship", href: "/userToShip" },
    { icon: <Truck className="w-6 h-6" />, label: "To Receive", href: "/to-receive" }
  ];

  // กำหนดรูปแบบข้อมูลสำหรับที่อยู่ใหม่
  const getEmptyAddress = (): AddressData => ({
    id: `addr-${Date.now()}`,
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
  });

  // เปิด Dialog สำหรับเพิ่มที่อยู่ใหม่
  const handleAddAddress = () => {
    setCurrentAddress(getEmptyAddress());
    setIsEditing(false);
    setIsAddressDialogOpen(true);
  };

  // เปิด Dialog สำหรับแก้ไขที่อยู่
  const handleEditAddress = (address: AddressData) => {
    setCurrentAddress({...address});
    setIsEditing(true);
    setIsAddressDialogOpen(true);
  };

  // ลบที่อยู่
  const handleDeleteAddress = (id: string) => {
    if (confirm("คุณต้องการลบที่อยู่นี้ใช่หรือไม่?")) {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses(updatedAddresses);
      toast({
        title: "ลบที่อยู่เรียบร้อยแล้ว",
        variant: "default",
      });
    }
  };

  // กำหนดที่อยู่เป็นค่าเริ่มต้น
  const handleSetDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    }));
    setAddresses(updatedAddresses);
    toast({
      title: "ตั้งเป็นที่อยู่หลักเรียบร้อยแล้ว",
      variant: "default",
    });
  };

  // บันทึกข้อมูลที่อยู่
  const handleSaveAddress = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!currentAddress) return;

    if (isEditing) {
      // อัปเดตที่อยู่ที่มีอยู่แล้ว
      const updatedAddresses = addresses.map(addr => 
        addr.id === currentAddress.id ? currentAddress : addr
      );
      setAddresses(updatedAddresses);
      toast({
        title: "อัปเดตที่อยู่เรียบร้อยแล้ว",
        variant: "default",
      });
    } else {
      // เพิ่มที่อยู่ใหม่
      setAddresses(prev => [...prev, currentAddress]);
      toast({
        title: "เพิ่มที่อยู่ใหม่เรียบร้อยแล้ว",
        variant: "default",
      });
    }
    
    setIsAddressDialogOpen(false);
    setCurrentAddress(null);
  };

  // อัปเดตค่าใน form สำหรับที่อยู่
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentAddress) return;
    
    const { name, value } = e.target;
    setCurrentAddress(prev => prev ? { ...prev, [name]: value } : null);
  };

  // อัปเดตค่าจาก select dropdown
  const handleSelectChange = (name: string, value: string) => {
    if (!currentAddress) return;
    setCurrentAddress(prev => prev ? { ...prev, [name]: value } : null);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <Navbar />

      {/* Search Bar */}
      <div className="flex justify-between items-center mt-6">
        <div className="relative w-full max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search Product"
            className="w-full px-4 py-2 rounded-full bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
          >
            <Search className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        <div className="flex space-x-6 ml-4">
          <Button variant="ghost" size="sm" className="p-1">
            <ShoppingCart className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1">
            <Bell className="w-6 h-6" />
          </Button>
        </div>
      </div>

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
            <Button 
              variant="outline" 
              onClick={handleAddAddress}
            >
              + Add New Address
            </Button>
          </div>
          
          {addresses.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              ไม่มีที่อยู่ โปรดเพิ่มที่อยู่ใหม่
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg border p-4 mb-4 relative">
                <div className="absolute right-4 top-4 flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditAddress(address)}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1 text-red-500" /> Delete
                  </Button>
                </div>
                <div className="flex items-center mb-2">
                  <input 
                    type="checkbox" 
                    className="mr-4 h-4 w-4" 
                    checked={address.isDefault}
                    onChange={() => handleSetDefaultAddress(address.id)}
                  />
                  {address.isDefault && <span className="text-sm text-green-600">Default Address</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">{address.firstname} {address.lastname}</p>
                    <p className="text-gray-600 mt-2">{address.phone}</p>
                    <p className="text-gray-600 mt-2">{address.province}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{address.district}, {address.subDistrict}</p>
                    <p className="text-gray-600 mt-2">{address.streetName}</p>
                    <p className="text-gray-600 mt-2">{address.postalCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{address.building}</p>
                    <p className="text-gray-600 mt-2">{address.houseNumber}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Address Form Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSaveAddress}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">ชื่อจริง</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={currentAddress?.firstname || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastname">นามสกุล</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={currentAddress?.lastname || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={currentAddress?.phone || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">จังหวัด</Label>
                <Select 
                  value={currentAddress?.province || ''} 
                  onValueChange={(value) => handleSelectChange('province', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกจังหวัด" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bangkok">กรุงเทพมหานคร</SelectItem>
                    <SelectItem value="Chiang Mai">เชียงใหม่</SelectItem>
                    <SelectItem value="Phuket">ภูเก็ต</SelectItem>
                    <SelectItem value="Chonburi">ชลบุรี</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="district">เขต/อำเภอ</Label>
                <Input
                  id="district"
                  name="district"
                  value={currentAddress?.district || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subDistrict">แขวง/ตำบล</Label>
                <Input
                  id="subDistrict"
                  name="subDistrict"
                  value={currentAddress?.subDistrict || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="streetName">ถนน</Label>
                <Input
                  id="streetName"
                  name="streetName"
                  value={currentAddress?.streetName || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="building">อาคาร/หมู่บ้าน</Label>
                <Input
                  id="building"
                  name="building"
                  value={currentAddress?.building || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="houseNumber">บ้านเลขที่</Label>
                <Input
                  id="houseNumber"
                  name="houseNumber"
                  value={currentAddress?.houseNumber || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">รหัสไปรษณีย์</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={currentAddress?.postalCode || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button type="submit">บันทึก</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}