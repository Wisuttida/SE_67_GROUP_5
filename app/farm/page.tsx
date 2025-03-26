"use client";
import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SideBarFarm from "@/components/SideBarFarm"; // Importing the SideBarFarm component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [profileImage, setProfileImage] = useState<string | null>(DEFAULT_PROFILE); // รูปในหน้าโปรไฟล์
  const [previewImage, setPreviewImage] = useState<string | null>(DEFAULT_PROFILE); // รูปใน Edit Dialog
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };
  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileImage(previewImage);
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast("บันทึกที่อยู่เรียบร้อยแล้ว");
      setShowAddressDialog(false);
    } catch (error) {
      toast("เกิดข้อผิดพลาดในการบันทึกที่อยู่");
    } finally {
      setIsLoading(false);
    }
  };
  interface BankInfo {
    bank_name: string;
    bank_number: string;
    bank_account: string;
  }
  const [tempBankInfo, setTempBankInfo] = useState<BankInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bankInfo, setBankInfo] = useState<BankInfo>({
      bank_name: '',
      bank_number: '',
      bank_account: '',
    });
  const bankOptions = [
    { value: 'ธนาคารกรุงเทพ (BBL)', label: 'ธนาคารกรุงเทพ (BBL)' },
    { value: 'ธนาคารกสิกรไทย (KBANK)', label: 'ธนาคารกสิกรไทย (KBANK)' },
    { value: 'ธนาคารไทยพาณิชย์ (SCB)', label: 'ธนาคารไทยพาณิชย์ (SCB)' },
    { value: 'ธนาคารกรุงไทย (KTB)', label: 'ธนาคารกรุงไทย (KTB)' },
    { value: 'ธนาคารกรุงศรีอยุธยา (BAY)', label: 'ธนาคารกรุงศรีอยุธยา (BAY)' },
    { value: 'ธนาคารทหารไทยธนชาต (TTB)', label: 'ธนาคารทหารไทยธนชาต (TTB)' },
    { value: 'ธนาคารซีไอเอ็มบี ไทย (CIMBT)', label: 'ธนาคารซีไอเอ็มบี ไทย (CIMBT)' },
    { value: 'ธนาคารยูโอบี (UOB Thailand)', label: 'ธนาคารยูโอบี (UOB Thailand)' },
    { value: 'ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)', label: 'ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)' },
    { value: 'ธนาคารออมสิน (GSB)', label: 'ธนาคารออมสิน (GSB)' },
  ];
  const bankSelect = (value : string) => {
    setBankInfo(prevState => ({
      ...prevState,
      bank_name: value,
    }));
  };
  const handleEditBankInfo = () => {
    setTempBankInfo({ ...bankInfo });
    setIsEditing(true);
  };
  const handleCancelBankEdit = () => {
    if (tempBankInfo) {
      setBankInfo(tempBankInfo); // คืนค่าที่แก้ไขกลับไป
    }
    setIsEditing(false); // ปิดโหมดแก้ไข
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // ตรวจสอบว่าเป็นเลขเท่านั้น และต้องไม่เกิน 10 หลัก (ปรับจำนวนหลักตามต้องการ)
    if (name === "bank_number") {
      const numericValue = value.replace(/[^0-9]/g, ''); // ลบตัวอักษรที่ไม่ใช่เลข
      if (numericValue.length <= 10) {
        setBankInfo((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setBankInfo((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSave = () => {
    const bankNumber = bankInfo.bank_number.replace(/\D/g, '');
    if (bankNumber.length !== 10) {
      toast("กรุณากรอกเลขบัญชีให้ครบ 10 หลัก");
      return;
    }
    console.log('Bank Info Saved:', bankInfo);
    setIsEditing(false);
    // axios.put(`${process.env.NEXT_PUBLIC_API_URL}/shop/updateBank`,
    //   {
    //     bank_name : bankInfo.bank_name,
    //     bank_account : bankInfo.bank_account,
    //     bank_number : bankInfo.bank_number,
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`,
    //       'X-Requested-With': 'XMLHttpRequest',
    //       'X-CSRF-TOKEN': csrf,
    //     },
    //     withCredentials: true,
    //   }
    // ).catch(error => {
    //   console.error('Error saving address:', error.response ? error.response.data : error.message);
    // });
    // axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shop/get`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Accept': 'application/json',
    //     'X-Requested-With': 'XMLHttpRequest',
    //     'X-CSRF-TOKEN': csrf,
    //   },
    //   withCredentials: true,
    // })
    // .then(res => {
    //   localStorage.setItem('shop', JSON.stringify(res.data.data.shop[0]));
    // })
    // .catch(error => {
    //   console.error("Error fetching address:", error);
    // });
  };
  return (
    <div>
      <Navbar />

      {/* Main Content with Sidebar Layout */}
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="hidden md:block">
          <SideBarFarm />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">

          {/* Profile Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 relative">
                    <Image 
                      src={profileImage || DEFAULT_PROFILE}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-2 font-medium">{farmData.username}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setShowEditDialog(true)} // Open edit dialog
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit Profile
                  </Button>
                </div>

                <div className="mt-6 md:mt-0 md:ml-10 text-center md:text-left">
                  <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Full Name</p>
                      <p>{farmData.firstname} {farmData.lastname}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p>{farmData.phoneNumber}</p>
                    </div>
                  </div>
                </div>
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
                <p>
                  {farmData.district} {farmData.province} {farmData.postalCode}
                </p>
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
          {/* ข้อมูลบัญชีธนาคาร */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
            <h3 className="text-xl font-semibold mb-4">🏦 ข้อมูลบัญชีธนาคาร</h3>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(bankInfo).map(([key, value]) => (
                  <div key={key}>
                    <label className="block mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                    {key === 'bank_name' ? (
                      <Select onValueChange={bankSelect} defaultValue={bankInfo.bank_name}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankOptions.map((bank) => (
                            <SelectItem key={bank.value} value={bank.value}>
                              {bank.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      ) : key === 'bank_number' ? (
                        <input
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="p-2 border rounded-lg w-full"
                          placeholder="เลขบัญชีธนาคาร"
                          maxLength={10} // กำหนดความยาวสูงสุดเป็น 10 หลัก
                        />
                      ) : (
                        <input
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="p-2 border rounded-lg w-full"
                          placeholder={key}
                        />
                    )}
                  </div>
                ))}
                <div className="flex justify-end mt-4 space-x-4">
                  <button onClick={handleCancelBankEdit} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
                  <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">บันทึก</button>
                </div>
              </div>
            ) : (
              <div>
                {Object.entries(bankInfo).map(([key, value]) => (
                  <p key={key}>{key.replace(/([A-Z])/g, ' $1')}: {value || '-'}</p>
                ))}
                <button onClick={handleEditBankInfo} className="text-blue-500 mt-4">✏️ แก้ไขข้อมูลบัญชีธนาคาร</button>
              </div>
            )}
          </div>
          {/* Edit Profile Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSaveProfile}>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 mx-auto">
                      <Image
                        src={previewImage || DEFAULT_PROFILE}
                        alt="Profile Preview"
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-4 text-sm"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={farmData.username}
                      onChange={(e) => setFarmData({ ...farmData, username: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstname">First Name</Label>
                      <Input
                        id="firstname"
                        value={farmData.firstname}
                        onChange={(e) => setFarmData({ ...farmData, firstname: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastname">Last Name</Label>
                      <Input
                        id="lastname"
                        value={farmData.lastname}
                        onChange={(e) => setFarmData({ ...farmData, lastname: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      value={farmData.description}
                      onChange={(e) => setFarmData({ ...farmData, description: e.target.value })}
                    />
                  </div>
                </div>
                
                <DialogFooter>
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
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
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
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={farmData.phoneNumber}
                      onChange={(e) => setFarmData({ ...farmData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      value={farmData.province}
                      onChange={(e) => setFarmData({ ...farmData, province: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={farmData.district}
                      onChange={(e) => setFarmData({ ...farmData, district: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subDistrict">Sub-district</Label>
                    <Input
                      id="subDistrict"
                      value={farmData.subDistrict}
                      onChange={(e) => setFarmData({ ...farmData, subDistrict: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={farmData.postalCode}
                      onChange={(e) => setFarmData({ ...farmData, postalCode: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="streetName">Street Name</Label>
                    <Input
                      id="streetName"
                      value={farmData.streetName}
                      onChange={(e) => setFarmData({ ...farmData, streetName: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="building">Building</Label>
                    <Input
                      id="building"
                      value={farmData.building}
                      onChange={(e) => setFarmData({ ...farmData, building: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="houseNo">House No.</Label>
                    <Input
                      id="houseNo"
                      value={farmData.houseNo}
                      onChange={(e) => setFarmData({ ...farmData, houseNo: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddressDialog(false)}
                    disabled={isLoading}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}