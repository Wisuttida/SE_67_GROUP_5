"use client";
import { Edit, Search, ShoppingCart, Bell, Store, Tractor, Grid, Clipboard, DollarSign, Upload, Truck, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from 'react';

const DEFAULT_IMAGES = {
  profile: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23f3f4f6'/%3E%3Cpath d='M48 48C54.6274 48 60 42.6274 60 36C60 29.3726 54.6274 24 48 24C41.3726 24 36 29.3726 36 36C36 42.6274 41.3726 48 48 48ZM48 52C40.0474 52 33.5 58.5474 33.5 66.5H62.5C62.5 58.5474 55.9526 52 48 52Z' fill='%239ca3af'/%3E%3C/svg%3E"
};

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
  isDefault: boolean;
}

interface ProfileMenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function ProfileUser() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
    { icon: <DollarSign className="w-6 h-6" />, label: "To Pay", href: "/userToPay" },
    { icon: <Upload className="w-6 h-6" />, label: "To Ship", href: "/userToShip" },
    { icon: <Truck className="w-6 h-6" />, label: "To Receive", href: "/userToReceive" }
  ];

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

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
    houseNumber: '',
    isDefault: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => {
      if (!prev) return getEmptyAddress();
      return { ...prev, [name]: value };
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentAddress(prev => {
      if (!prev) return getEmptyAddress();
      return { ...prev, [name]: value };
    });
  };

  const handleAddAddress = () => {
    setCurrentAddress(getEmptyAddress());
    setIsEditing(false);
    setIsAddressDialogOpen(true);
  };

  const handleEditAddress = (address: AddressData) => {
    setCurrentAddress({ ...address });
    setIsEditing(true);
    setIsAddressDialogOpen(true);
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      if (confirm("คุณต้องการลบที่อยู่นี้ใช่หรือไม่?")) {
        setIsLoading(true);
        const updatedAddresses = addresses.filter(addr => addr.id !== id);
        setAddresses(updatedAddresses);
        toast("ลบที่อยู่เรียบร้อยแล้ว");
      }
    } catch (error) {
      toast("ไม่สามารถลบที่อยู่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      setIsLoading(true);
      const updatedAddresses = addresses.map(address => ({
        ...address,
        isDefault: address.id === id
      }));
      setAddresses(updatedAddresses);
      toast("ตั้งเป็นที่อยู่หลักเรียบร้อยแล้ว");
    } catch (error) {
      toast("ไม่สามารถตั้งค่าที่อยู่หลักได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!currentAddress) return;

    if (!validatePhoneNumber(currentAddress.phone)) {
      toast("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง กรุณากรอกในรูปแบบ 0XX-XXX-XXXX");
      return;
    }

    try {
      setIsLoading(true);
      if (isEditing) {
        const updatedAddresses = addresses.map(addr => 
          addr.id === currentAddress.id ? currentAddress : addr
        );
        setAddresses(updatedAddresses);
        toast("อัปเดตที่อยู่เรียบร้อยแล้ว");
      } else {
        setAddresses(prev => [...prev, currentAddress]);
        toast("เพิ่มที่อยู่ใหม่เรียบร้อยแล้ว");
      }
      
      setIsAddressDialogOpen(false);
      setCurrentAddress(null);
    } catch (error) {
      toast("ไม่สามารถบันทึกที่อยู่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAddresses = addresses.filter(address => 
    address.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  interface UserData {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    profile_image: string | null;
  }
  const [user_data, setUserData] = useState<UserData | undefined>(undefined);
  useEffect(() => {
    const user_dataGet = localStorage.getItem('user_data');
    if (user_dataGet) {
        try {
            const data: UserData = JSON.parse(user_dataGet);
            setUserData(data);
            console.log(data);
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
        }
    }
  }, []);

  return (
    <div>
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
                  src={DEFAULT_IMAGES.profile}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <p className="mt-2 font-medium">{user_data?.username}</p>
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
              disabled={isLoading}
            >
              + Add New Address
            </Button>
          </div>
          
          {filteredAddresses.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              {searchQuery ? "ไม่พบที่อยู่ที่ค้นหา" : "ไม่มีที่อยู่ โปรดเพิ่มที่อยู่ใหม่"}
            </div>
          ) : (
            filteredAddresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg border p-4 mb-4 relative">
                <div className="absolute right-4 top-4 flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditAddress(address)}
                    disabled={isLoading}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์ (0XX-XXX-XXXX)</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={currentAddress?.phone || ''}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  placeholder="0XX-XXX-XXXX"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">จังหวัด</Label>
                <select
                  id="province"
                  name="province"
                  className="w-full px-3 py-2 border rounded-md"
                  value={currentAddress?.province || ''}
                  onChange={(e) => handleSelectChange('province', e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">เลือกจังหวัด</option>
                  <option value="Bangkok">กรุงเทพมหานคร</option>
                  <option value="Chiang Mai">เชียงใหม่</option>
                  <option value="Phuket">ภูเก็ต</option>
                  <option value="Chonburi">ชลบุรี</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="district">เขต/อำเภอ</Label>
                <Input
                  id="district"
                  name="district"
                  value={currentAddress?.district || ''}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="streetName">ถนน</Label>
                <Input
                  id="streetName"
                  name="streetName"
                  value={currentAddress?.streetName || ''}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="building">อาคาร/หมู่บ้าน</Label>
                <Input
                  id="building"
                  name="building"
                  value={currentAddress?.building || ''}
                  onChange={handleInputChange}
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  pattern="[0-9]{5}"
                  placeholder="XXXXX"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
  <Button 
    type="button" 
    variant="outline" 
    onClick={() => {
      setIsAddressDialogOpen(false);
      setCurrentAddress(null);
    }}
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
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        กำลังบันทึก...
      </div>
    ) : (
      "บันทึก"
    )}
  </Button>
</div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}