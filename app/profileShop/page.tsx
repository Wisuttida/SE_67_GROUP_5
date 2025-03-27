"use client";

import Navbar from '@/components/Navbar';
import SideBarShop from '@/components/SideBarShop';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressInfo {
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
  position_id: string;
}

interface BankInfo {
  ธนาคาร: string;
  เลขบัญชี: string;
  ชื่อ: string;
}

const ProfileShop = () => {
  let csrf = localStorage.getItem('csrfToken');
  let token = localStorage.getItem('token');
  const { toast } = useToast();
  const [isAddressAdding, setIsAddressAdding] = useState(false);
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  
  // เก็บค่าก่อนแก้ไข
  const [tempAddressInfo, setTempAddressInfo] = useState<AddressInfo | null>(null);
  const [tempDescription, setTempDescription] = useState('');
  const [tempBankInfo, setTempBankInfo] = useState<BankInfo | null>(null);

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
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
    position_id: '',
  });
  const [multiaddressInfo, setMultiAddressInfo] = useState<AddressInfo[]>([{
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
    position_id: '',
  }]);

  const [bankInfo, setBankInfo] = useState<BankInfo>({
    ธนาคาร: '',
    เลขบัญชี: '',
    ชื่อ: '',
  });

  // เปิดโหมดแก้ไขและเก็บค่าก่อนหน้า
  const handleEditAddress = () => {
    setTempAddressInfo({ ...addressInfo });
    setIsAddressEditing(true);
  };
  const handleAddAddress = () => {
    setTempAddressInfo({ ...addressInfo });
    setIsAddressAdding(true);
  };

  const handleEditDescription = () => {
    setTempDescription(description);
    setIsDescriptionEditing(true);
  };

  const handleEditBankInfo = () => {
    setTempBankInfo({ ...bankInfo });
    setIsEditing(true);
  };

  // ยกเลิกการแก้ไข (คืนค่ากลับ)
  const handleCancelAddressEdit = () => {
    if (tempAddressInfo) {
      setAddressInfo(tempAddressInfo);
    }
    setIsAddressEditing(false);
  };

  const handleCancelDescriptionEdit = () => {
    setDescription(tempDescription);
    setIsDescriptionEditing(false);
  };

  const handleCancelBankEdit = () => {
    if (tempBankInfo) {
      setBankInfo(tempBankInfo); // คืนค่าที่แก้ไขกลับไป
    }
    setIsEditing(false); // ปิดโหมดแก้ไข
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // ตรวจสอบว่าเป็นเลขเท่านั้น และต้องไม่เกิน 12 หลัก (ปรับจำนวนหลักตามต้องการ)
    if (name === "เลขบัญชี") {
      const numericValue = value.replace(/[^0-9]/g, ''); // ลบตัวอักษรที่ไม่ใช่เลข
      if (numericValue.length <= 12) {
        setBankInfo((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setBankInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    const bankNumber = bankInfo.เลขบัญชี.replace(/\D/g, '');
    if (bankNumber.length !== 12) {
      toast("กรุณากรอกเลขบัญชีให้ครบ 12 หลัก");
      return;
    }
    console.log('Bank Info Saved:', bankInfo);
    setIsEditing(false);
    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/shop/updateBank`,
      {
        bank_name : bankInfo.ธนาคาร,
        bank_account : bankInfo.ชื่อ,
        bank_number : bankInfo.เลขบัญชี,
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
      console.error('Error saving address:', error.response ? error.response.data : error.message);
    });
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shop/get`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrf,
      },
      withCredentials: true,
    })
    .then(res => {
      localStorage.setItem('shop', JSON.stringify(res.data.data.shop[0]));
    })
    .catch(error => {
      console.error("Error fetching address:", error);
    });
  };

  const handleDescriptionSave = () => {
    console.log('Description Saved:', description);
    setIsDescriptionEditing(false);
    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/shop/updateDescription`,
      {
        description : description,
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
      console.error('Error saving address:', error.response ? error.response.data : error.message);
    });
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shop/get`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrf,
      },
      withCredentials: true,
    })
    .then(res => {
      localStorage.setItem('shop', JSON.stringify(res.data.data.shop[0]));
      toast("อัปเดตคำอธิบายร้านแล้ว");
    })
    .catch(error => {
      console.error("Error fetching address:", error);
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Handle phone number: only digits and max 10 digits
    if (name === "phonenumber") {
      const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      if (numericValue.length <= 10) {
        setAddressInfo((prev) => ({ ...prev, [name]: numericValue })); // Update phone number
      }
    } else {
      setAddressInfo((prev) => ({ ...prev, [name]: value })); // Update other fields
    }
  };

  const handleAddressSave = () => {
    // ตรวจสอบเบอร์โทรศัพท์
    const phonePattern = /^[0-9]{10}$/; // ตรวจสอบว่าเบอร์ต้องเป็นตัวเลข 10 หลัก
    if (!phonePattern.test(addressInfo.phonenumber)) {
      toast("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)");
      return; // ไม่ทำการบันทึกหากเบอร์โทรศัพท์ไม่ถูกต้อง
    }
  
    setIsAddressEditing(false);
    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressInfo.address_id}`,
      {
        fname : addressInfo.fname,
        lname : addressInfo.lname,
        phonenumber : addressInfo.phonenumber,
        street_name : addressInfo.street_name,
        house_number : addressInfo.house_number,
        building : addressInfo.building,
        province : addressInfo.province,
        district : addressInfo.district,
        subDistrict : addressInfo.subDistrict,
        zipcode : addressInfo.zipcode,
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
  };

  const handleAddressAddSave = () => {
    // ตรวจสอบเบอร์โทรศัพท์
    const phonePattern = /^[0-9]{10}$/; // ตรวจสอบว่าเบอร์ต้องเป็นตัวเลข 10 หลัก
    if (!phonePattern.test(addressInfo.phonenumber)) {
      toast("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)");
      return; // ไม่ทำการบันทึกหากเบอร์โทรศัพท์ไม่ถูกต้อง
    }
  
    setIsAddressAdding(false);
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/addresses/`,
      {
        fname : addressInfo.fname,
        lname : addressInfo.lname,
        phonenumber : addressInfo.phonenumber,
        street_name : addressInfo.street_name,
        house_number : addressInfo.house_number,
        building : addressInfo.building,
        province : addressInfo.province,
        district : addressInfo.district,
        subDistrict : addressInfo.subDistrict,
        zipcode : addressInfo.zipcode,
        position_id: 2,
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
  };
  

  interface ShopData {
    shop_id: number;
    shop_name: string;
    shop_image: string | null;
    description: string | null;
    accepts_custom: number;
    bank_name: string;
    bank_account: string;
    bank_number: string;
    addresses_address_id: string | null;
  }
  const [shop_data, setShopData] = useState<ShopData | undefined>(undefined);
  useEffect(() => {
    const shop_dataGet = localStorage.getItem('shop');
    if (shop_dataGet) {
      try {
        const data: ShopData = JSON.parse(shop_dataGet);
        setShopData(data);
        setBankInfo(prevState => ({
          ...prevState,
          ธนาคาร: data.bank_name,
          เลขบัญชี: data.bank_number,
          ชื่อ: data.bank_account,
        }));
        if (data.description) {
          setDescription(data.description);
        } else {
          setDescription(''); // Set to an empty string or any default value you prefer
        }
      } catch (error) {
        console.error('Error parsing shop data from localStorage:', error);
      }
    }
    const addressGet = localStorage.getItem('addresses');
    if (addressGet) {
      try {
        const data: AddressInfo[] = JSON.parse(addressGet);
        const filteredAddresses: AddressInfo[] = data.filter(address => Number(address.position_id) === 2);
        if(filteredAddresses.length > 0) {
          setAddressInfo(prevState => ({
            ...prevState,
            fname: filteredAddresses[0].fname,
            lname: filteredAddresses[0].lname,
            building: filteredAddresses[0].building,
            phonenumber: filteredAddresses[0].phonenumber,
            house_number: filteredAddresses[0].house_number,
            street_name: filteredAddresses[0].street_name,
            subDistrict: filteredAddresses[0].subDistrict,
            district: filteredAddresses[0].district,
            province: filteredAddresses[0].province,
            zipcode: filteredAddresses[0].zipcode,
            address_id: filteredAddresses[0].address_id,
            position_id: filteredAddresses[0].position_id,
          }));
        }
      } catch (error) {
        console.error('Error parsing shop data from localStorage:', error);
      }
    }
  }, []);

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
      ธนาคาร: value,
    }));
  };
  const keyMapping: { [key in keyof AddressInfo]?: string } = {
    fname: 'ชื่อ',
    lname: 'นามสกุล',
    phonenumber: 'เบอร์โทรฯ',
    province: 'จังหวัด',
    district: 'อำเภอ',
    subDistrict: 'ตำบล',
    zipcode: 'รหัสไปรษณี',
    street_name: 'ถนน/ซอย',
    building: 'ตึก',
    house_number: 'บ้านเลขที่',
  };
  const keyOrder: (keyof AddressInfo)[] = [
    'fname',
    'lname',
    'phonenumber',
    'house_number',
    'street_name',
    'building',
    'subDistrict',
    'district',
    'province',
    'zipcode',
  ];
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* เริ่มต้น Flexbox Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div>
          <SideBarShop />
        </div>

        {/* Content */}
        <div className="flex-1 max-w-screen-xl mx-auto px-4 py-6">
          {/* ที่อยู่ร้าน */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
            <h3 className="text-xl font-semibold mb-4">📍 ที่อยู่ร้าน</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {keyOrder.map((key) => {
                  // Check if the key exists in addressInfo and is not excluded
                  if (key in addressInfo) {
                      return (
                          <div key={key} className="border-b pb-1 capitalize">
                              {keyMapping[key] || key.replace(/([A-Z])/g, ' $1')}: {addressInfo[key] || '-'}
                          </div>
                      );
                  }
                  return null; // Return null for keys that should not be rendered
              })}
            </div>
            {(addressInfo.address_id === '') ? 
              (<button onClick={handleAddAddress} className="text-blue-500 mt-4">➕ เพิ่มที่อยู่</button>) : (null)
            }
            <button onClick={handleEditAddress} className="text-blue-500 mt-4">✏️ แก้ไขที่อยู่</button>
          </div>
          {isAddressAdding && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                <h2 className="text-2xl font-semibold mb-6">แก้ไขที่อยู่</h2>
                <div className="grid grid-cols-2 gap-4">
                  {keyOrder.map((key) => {
                      // Check if the key exists in addressInfo and is not excluded
                      if (key in addressInfo) {
                          return (
                              <div key={key}>
                                  <label>{keyMapping[key] || key.replace(/([A-Z])/g, ' $1')}</label>
                                  <input
                                    name={key}
                                    value={addressInfo[key] as string}
                                    onChange={handleAddressChange}
                                    className="border p-2 rounded-lg w-full"
                                  />
                              </div>
                          );
                      }
                      return null; // Return null for keys that should not be rendered
                  })}
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                  <button onClick={handleCancelAddressEdit} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
                  <button onClick={handleAddressAddSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">บันทึก</button>
                </div>
              </div>
            </div>
          )}
          {isAddressEditing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                <h2 className="text-2xl font-semibold mb-6">แก้ไขที่อยู่</h2>
                <div className="grid grid-cols-2 gap-4">
                  {keyOrder.map((key) => {
                      // Check if the key exists in addressInfo and is not excluded
                      if (key in addressInfo) {
                          return (
                              <div key={key}>
                                  <label>{keyMapping[key] || key.replace(/([A-Z])/g, ' $1')}</label>
                                  <input
                                    name={key}
                                    value={addressInfo[key] as string}
                                    onChange={handleAddressChange}
                                    className="border p-2 rounded-lg w-full"
                                  />
                              </div>
                          );
                      }
                      return null; // Return null for keys that should not be rendered
                  })}
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                  <button onClick={handleCancelAddressEdit} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
                  <button onClick={handleAddressSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">บันทึก</button>
                </div>
              </div>
            </div>
          )}

          {/* คำอธิบายร้าน */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
            <h3 className="text-xl font-semibold mb-4">📋 คำอธิบายร้าน</h3>
            {isDescriptionEditing ? (
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 border rounded-lg"
                  placeholder="คำอธิบายร้าน"
                />
                <div className="flex justify-end mt-4 space-x-4">
                  <button onClick={handleCancelDescriptionEdit} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
                  <button onClick={handleDescriptionSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">บันทึก</button>
                </div>
              </div>
            ) : (
              <p>{description || 'ไม่มีคำอธิบาย'}</p>
            )}
            {!isDescriptionEditing && (
              <button onClick={handleEditDescription} className="text-blue-500 mt-4">✏️ แก้ไขคำอธิบาย</button>
            )}
          </div>

          {/* ข้อมูลบัญชีธนาคาร */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
            <h3 className="text-xl font-semibold mb-4">🏦 ข้อมูลบัญชีธนาคาร</h3>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(bankInfo).map(([key, value]) => (
                  <div key={key}>
                    <label className="block mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                    {key === 'ธนาคาร' ? (
                      <Select onValueChange={bankSelect} defaultValue={value}>
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
                    ) : key === 'เลขบัญชี' ? (
                      <input
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="p-2 border rounded-lg w-full"
                        placeholder="เลขบัญชีธนาคาร"
                        maxLength={12} // กำหนดความยาวสูงสุดเป็น 12 หลัก
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
        </div>
      </div>
    </div>
  );
};

export default ProfileShop;
