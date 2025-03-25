"use client";
import { Edit, Search, ShoppingCart, Bell, Store, Tractor, Grid, Clipboard, DollarSign, Upload, Truck, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SideBarUser from "@/components/SideBarUser";
import DropdownList from "@/components/ui/DropdownList"; // Importing the DropdownList component
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
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [selected, setSelected] = useState({
    province_id: undefined,
    amphure_id: undefined,
    tambon_id: undefined,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<AddressData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
        }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json'
      );
      const result = await response.json();
      setProvinces(result);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json'
      );
      const result = await response.json();
      setProvinces(result);
    };

    fetchData();
  }, []);

  const DropdownList = ({
    label,
    id,
    list,
    child,
    childsId = [],
    setChilds = [],
  }) => {
    const onChangeHandle = (event) => {
      setChilds.forEach((setChild) => setChild([]));
      const entries = childsId.map((child) => [child, undefined]);
      const unSelectChilds = Object.fromEntries(entries);

      const input = event.target.value;
      const dependId = input ? Number(input) : undefined;
      setSelected((prev) => ({ ...prev, ...unSelectChilds, [id]: dependId }));

      if (!input) return;

      if (child) {
        const parent = list.find((item) => item.id === dependId);
        const { [child]: childs } = parent;
        const [setChild] = setChilds;
        setChild(childs);
      }
    };

    return (
      <>
        <label htmlFor={label}>{label}</label>
        <select value={selected[id]} onChange={onChangeHandle} className="w-full px-3 py-2 border rounded-md">
          <option label="เลือกข้อมูล ..." />
          {list &&
            list.map((item) => (
              <option
                key={item.id}
                value={item.id}
                label={`${item.name_th} - ${item.name_en}`}
              />
            ))}
        </select>
      </>
    );
  };

  return (
    <div>
      <Navbar />

      {/* Main Content with Sidebar Layout */}
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="hidden md:block">
          <SideBarUser />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Search Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                placeholder="Search Address"
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
            <div className="flex space-x-4 ml-4">
              <Button variant="ghost" size="sm" className="p-1">
                <ShoppingCart className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <Bell className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Profile Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center">
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

                <div className="mt-6 md:mt-0 md:ml-10 text-center md:text-left">
                  <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Full Name</p>
                      <p>{user_data?.first_name} {user_data?.last_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p>{user_data?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p>{user_data?.phone_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">User ID</p>
                      <p>{user_data?.user_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Section */}
          <Card>
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
        </div>
      </div>

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
                <DropdownList
                  label="จังหวัด"
                  id="province_id"
                  list={provinces}
                  child="amphure"
                  childsId={["amphure_id", "tambon_id"]}
                  setChilds={[setAmphures, setTambons]}
                  selected={selected}
                  setSelected={setSelected}
                />
                <DropdownList
                  label="จังหวัด"
                  id="province_id"
                  list={provinces}
                  child="amphure"
                  childsId={["amphure_id", "tambon_id"]}
                  setChilds={[setAmphures, setTambons]}
                />
              </div>
              
              <div className="space-y-2">
                <DropdownList
                  label="เขต/อำเภอ"
                  id="amphure_id"
                  list={amphures}
                  child="tambon"
                  childsId={["tambon_id"]}
                  setChilds={[setTambons]}
                  selected={selected}
                  setSelected={setSelected}
                <DropdownList
                  label="เขต/อำเภอ"
                  id="amphure_id"
                  list={amphures}
                  child="tambon"
                  childsId={["tambon_id"]}
                  setChilds={[setTambons]}
                />
              </div>
              
              <div className="space-y-2">
                <DropdownList 
                  label="แขวง/ตำบล" 
                  id="tambon_id" 
                  list={tambons} 
                  selected={selected}
                  setSelected={setSelected}
                />
                <DropdownList 
                  label="แขวง/ตำบล" 
                  id="tambon_id" 
                  list={tambons} 
                />
                <pre>{JSON.stringify(selected, null, 4)}</pre>
              </div>
              
              <div className="space-y-2">
                <DropdownList 
                  label="แขวง/ตำบล" 
                  id="tambon_id" 
                  list={tambons} 
                />
                <pre>{JSON.stringify(selected, null, 4)}</pre>
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