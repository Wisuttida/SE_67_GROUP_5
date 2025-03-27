"use client";
import { Edit, Search, ShoppingCart, Bell, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SideBarUser from "@/components/SideBarUser";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { ImageKitProvider, IKImage, IKUpload } from "imagekitio-next";
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth");
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const DEFAULT_IMAGES = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
interface AddressData {
  address_id: string;
  fname: string;
  lname: string;
  phonenumber: string;
  street_name: string;
  building: string;
  subDistrict: string;
  district: string;
  province: string;
  zipcode: string;
  house_number: string;
  is_default: boolean;
  users_user_id: number;
  position_id: number;
}

export default function ProfileUser() {
    let csrf = localStorage.getItem('csrfToken');
    let token = localStorage.getItem('token');
    const router = useRouter();
    const { toast } = useToast();
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    interface UserData {
        user_id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        profile_image: string | null;
    }
    const [user_data, setUserData] = useState<UserData | undefined>(undefined);
    const [temp_user_data, setTempUserData] = useState<UserData | undefined>(undefined);
    const [addresses, setAddresses] = useState<AddressData[]>([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<AddressData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const formData = new FormData();
    const [image_url, setImageUrl] = useState<String>('');

    const onError = (err) => {
      console.log("Error", err);
    };
    const onSuccess = (res) => {
      console.log("Success", res);
      setImageUrl(res.url);
    };
    
    useEffect(() => {
        const user_dataGet = localStorage.getItem('user_data');
        if (user_dataGet) {
            try {
                const data: UserData = JSON.parse(user_dataGet);
                setUserData(data);
                setTempUserData(data);
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        }
        const addressGet = localStorage.getItem('addresses');
        if (addressGet) {
          try {
            const data: AddressData[] = JSON.parse(addressGet);
            const filteredAddresses: AddressData[] = data.filter(address => address.position_id === 4);
            setAddresses(filteredAddresses);
          } catch (error) {
            console.error('Error parsing shop data from localStorage:', error);
          }
        }
      }, []);

    const validatePhoneNumber = (phone: string) => {
    const phoneRegexZero = /^[1-9]\d+$/;
    const phoneRegexNumber = /[A-Za-z]+/;
    const phoneRegexLenght = /^\d{9,10}$/;
    if(phoneRegexZero.test(phone)) {
        return 0;
    }
    else if(phoneRegexNumber.test(phone)) {
        return 1;
    }
    else if(!phoneRegexLenght.test(phone)) {
        return 2;
    }
    else
        return 3;
    };

    const getEmptyAddress = (): AddressData => ({
        address_id: '',
        fname: '',
        lname: '',
        phonenumber: '',
        province: '',
        district: '',
        subDistrict: '',
        zipcode: '',
        street_name: '',
        building: '',
        house_number: '',
        is_default: false,
        users_user_id: user_data?.user_id ?? 0,
        position_id: 0,
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentAddress((prev) => {
            if (!prev) return getEmptyAddress();
            return { ...prev, [name]: value } as AddressData;
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
            const updatedAddresses = addresses.filter(addr => addr.address_id !== id);
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
            isDefault: address.address_id === id
          }));
          setAddresses(updatedAddresses);
          axios.put(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}`,
            {
              is_default: true,
              position_id: 4,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf,
              },
              withCredentials: true,
            }
          )
          .then(res => {
            toast("ตั้งเป็นที่อยู่หลักเรียบร้อยแล้ว");
          })
          .catch(error => {
            console.error('Error saving address:', error.response ? error.response.data : error.message);
          });
          
          // เรียกข้อมูลใหม่เพื่ออัพเดตที่อยู่
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRF-TOKEN': csrf,
            },
            withCredentials: true,
          })
          .then(res => {
            localStorage.setItem('addresses', JSON.stringify(res.data.data));
            window.location.reload();
          })
          .catch(error => {
            console.error("Error fetching address:", error);
          });
        } catch (error) {
          toast("ไม่สามารถตั้งค่าที่อยู่หลักได้ กรุณาลองใหม่อีกครั้ง");
        } finally {
          setIsLoading(false);
        }
    };
    const handleSaveAddress = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!currentAddress) return;
    
        if (validatePhoneNumber(currentAddress.phonenumber) == 0) {
          toast("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง กรุณาเริ่มต้นด้วย 0");
          return;
        }else if (validatePhoneNumber(currentAddress.phonenumber) == 1){
          toast("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง กรุณากรอกตัวเลข");
          return;
        }else if (validatePhoneNumber(currentAddress.phonenumber) == 2) {
          toast("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง กรุณากรอกระหว่าง 9-10 ตัว");
          return;
        }
    
        try {
          setIsLoading(true);
          if (isEditing) {
            const updatedAddresses = addresses.map(addr => 
              addr.address_id === currentAddress.address_id ? currentAddress : addr
            );
            setAddresses(updatedAddresses);
            axios.put(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${currentAddress.address_id}`,
              {
                fname : currentAddress.fname,
                lname : currentAddress.lname,
                phonenumber : currentAddress.phonenumber,
                street_name : currentAddress.street_name,
                house_number : currentAddress.house_number,
                building : currentAddress.building,
                province : currentAddress.province,
                district : currentAddress.district,
                subDistrict : currentAddress.subDistrict,
                zipcode : currentAddress.zipcode,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'X-Requested-With': 'XMLHttpRequest',
                  'X-CSRF-TOKEN': csrf,
                },
                withCredentials: true,
              }
            ).then(res => {
              toast("อัปเดตที่อยู่เรียบร้อยแล้ว");
            }).catch(error => {
              console.error('Error saving address:', error.response ? error.response.data : error.message);
            });
          } else {
            setAddresses(prev => [...prev, currentAddress]);
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/addresses/`,
              {
                fname : currentAddress.fname,
                lname : currentAddress.lname,
                phonenumber : currentAddress.phonenumber,
                street_name : currentAddress.street_name,
                house_number : currentAddress.house_number,
                building : currentAddress.building,
                province : currentAddress.province,
                district : currentAddress.district,
                subDistrict : currentAddress.subDistrict,
                zipcode : currentAddress.zipcode,
                position_id: 4,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'X-Requested-With': 'XMLHttpRequest',
                  'X-CSRF-TOKEN': csrf,
                },
                withCredentials: true,
              }
            ).then(res => {
              toast("เพิ่มที่อยู่ใหม่เรียบร้อยแล้ว");
            }).catch(error => {
              console.error('Error saving address:', error.response ? error.response.data : error.message);
            });
          }
        // เรียกข้อมูลใหม่เพื่ออัพเดตที่อยู่
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
            headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrf,
            },
            withCredentials: true,
        })
        .then(res => {
            localStorage.setItem('addresses', JSON.stringify(res.data.data));
        })
        .catch(error => {
            console.error("Error fetching address:", error);
        });

        setIsAddressDialogOpen(false);
        setCurrentAddress(null);
        } catch (error) {
        toast("ไม่สามารถบันทึกที่อยู่ได้ กรุณาลองใหม่อีกครั้ง");
        } finally {
        setIsLoading(false);
        }
  };

  const filteredAddresses: AddressData[] = addresses.filter(address => 
    address.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.phonenumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.house_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.street_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.subDistrict.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.zipcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  const handleSaveProfile = async (e : Event) => {
    e.preventDefault();
    setIsLoading(true);
    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/updateProfile`,
      {
        first_name : user_data?.first_name,
        last_name : user_data?.last_name,
        profile_image : image_url
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrf,
        },
        withCredentials: true,
      }
    ).catch(error => {
      console.error('Error saving profile:', error.response ? error.response.data : error.message);
    });
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/get/${user_data?.user_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrf,
      },
      withCredentials: true,
    })
    .then(res => {
      localStorage.setItem('user_data', JSON.stringify(res.data.data));
      window.location.reload();
    })
    .catch(error => {
      console.error("Error fetching address:", error);
    });
    //Save the profile (API call can be added here)
    console.log("Saved Profile:", user_data);
    
    setImageUrl('');
    setIsLoading(false);
    setIsProfileDialogOpen(false);
  };
  const getEmptyProfile = (): UserData => ({
    user_id: 0,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    profile_image: '',
  });
  const handleInputChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      if (!prev) return getEmptyProfile(); // ใช้ค่าเริ่มต้นหาก prev เป็น null หรือ undefined
      return { ...prev, [name]: value }; // อัปเดตค่าใน state
    });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      formData.append('file', file);
      setTempUserData((prev) => {
        if (!prev) {
          // ถ้า prev เป็น undefined ให้คืนค่าฐานข้อมูลเริ่มต้นที่มีข้อมูลครบถ้วน
          return {
            profile_image: imageUrl,
            user_id: -1, // กำหนด user_id เป็น -1 หรือค่าที่เหมาะสม
            username: '',
            email: '',
            first_name: '',
            last_name: '',
          };
        }
        
        return { 
          ...prev, 
          profile_image: imageUrl, // อัปเดตรูปโปรไฟล์
        };
      });
    }
  };
  useEffect(() => {
    if (image_url) {
      return; // Set loading to false when addressInfo is available
    }
  }, [image_url]);
  
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
          </div>

          {/* Profile Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                  <img 
                    src={user_data?.profile_image || DEFAULT_IMAGES} 
                    alt="Profile Image" 
                    className="w-full h-full object-cover"
                  />
                  </div>
                  <p className="mt-2 font-medium">{user_data?.username}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setIsProfileDialogOpen(true)}
                  >
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
                      <p className="text-gray-500">User ID</p>
                      <p>{user_data?.user_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Edit Profile */}
<Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
  <DialogContent className="sm:max-w-2xl">
    <DialogHeader>
      <DialogTitle>แก้ไขโปรไฟล์</DialogTitle>
    </DialogHeader>
    
    <form onSubmit={handleSaveProfile}>
      {/* Section for Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <Label htmlFor="profile_image" className="mb-2">รูปโปรไฟล์</Label>
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
          <img 
            src={temp_user_data?.profile_image || DEFAULT_IMAGES} 
            alt="Profile Image" 
            className="w-full h-full object-cover"
          />
        </div>
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
          <div>
            <h2>File upload</h2>
            <IKUpload fileName="test-upload.png" onError={onError} onSuccess={onSuccess} onChange={handleImageChange} className="file:py-2 file:px-4 file:border file:border-blue-600 file:rounded-md"/>
          </div>
        </ImageKitProvider>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">ชื่อจริง</Label>
          <Input
            id="first_name"
            name="first_name"
            value={user_data?.first_name || ''}
            onChange={handleInputChangeProfile}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">นามสกุล</Label>
          <Input
            id="last_name"
            name="last_name"
            value={user_data?.last_name || ''}
            onChange={handleInputChangeProfile}
            required
            disabled={isLoading}
          />
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="email">อีเมล</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={user_data?.email || ''}
            onChange={handleInputChangeProfile}
            required
            disabled={isLoading}
          />
        </div> */}
      </div>
      
      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsProfileDialogOpen(false)} 
          disabled={isLoading}
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
                  <div key={address.address_id} className="bg-white rounded-lg border p-4 mb-4 relative">
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
                        onClick={() => handleDeleteAddress(address.address_id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4 mr-1 text-red-500" /> Delete
                      </Button>
                    </div>
                    <div className="flex items-center mb-2">
                      <input 
                        type="checkbox" 
                        className="mr-4 h-4 w-4" 
                        checked={address.is_default}
                        onChange={() => handleSetDefaultAddress(address.address_id)}
                        disabled={isLoading}
                      />
                      {address.is_default ? <span className="text-sm text-green-600">Default Address</span> : null}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-medium">{address.fname} {address.lname}</p>
                        <p className="text-gray-600 mt-2">{address.phonenumber}</p>
                        <p className="text-gray-600 mt-2">{address.province}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">{address.district}, {address.subDistrict}</p>
                        <p className="text-gray-600 mt-2">{address.street_name}</p>
                        <p className="text-gray-600 mt-2">{address.zipcode}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">{address.building}</p>
                        <p className="text-gray-600 mt-2">{address.house_number}</p>
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
                <Label htmlFor="fname">ชื่อจริง</Label>
                <Input
                  id="fname"
                  name="fname"
                  value={currentAddress?.fname || ''}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lname">นามสกุล</Label>
                <Input
                  id="lname"
                  name="lname"
                  value={currentAddress?.lname || ''}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phonenumber">เบอร์โทรศัพท์ (0XXXXXXXXX)</Label>
                <Input
                  id="phonenumber"
                  name="phonenumber"
                  value={currentAddress?.phonenumber || ''}
                  onChange={handleInputChange}
                  // pattern="^0[0-9]{8,9}$"
                  required
                  placeholder="0XXXXXXXXX"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street_name">ถนน</Label>
                <Input
                  id="street_name"
                  name="street_name"
                  value={currentAddress?.street_name || ''}
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
                <Label htmlFor="house_number">บ้านเลขที่</Label>
                <Input
                  id="house_number"
                  name="house_number"
                  value={currentAddress?.house_number || ''}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subDistrict">ตำบล</Label>
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
                <Label htmlFor="district">อำเภอ</Label>
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
                <Label htmlFor="province">จังหวัด</Label>
                <Input
                  id="province"
                  name="province"
                  value={currentAddress?.province || ''}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipcode">รหัสไปรษณีย์</Label>
                <Input
                  id="zipcode"
                  name="zipcode"
                  value={currentAddress?.zipcode || ''}
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