"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';


function RegisterShop() {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState('');
  const [formData, setFormData] = useState({
    'shop_name': "",
    'accepts_custom': false,
    'bank_name': "",
    'bank_account': "",
    'bank_number': "",
    'users_user_id': ""
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user_data = localStorage.getItem('user_data');
    if(user_data) {
      const user = JSON.parse(user_data);
      setFormData((prevData) => ({
        ...prevData,
        users_user_id: user.user_id, // Update users_user_id whenever userId changes
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement; // Type assertion here
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox differently
    });
  };
  

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage(''); // Clear any previous error messages

    try {
        console.log('Submitting registration form...');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/registerShop`, {
            shop_name: formData.shop_name,
            accepts_custom: formData.accepts_custom,
            bank_name: formData.bank_name,
            bank_account: formData.bank_account,
            bank_number: formData.bank_number,
            users_user_id: formData.users_user_id
        }, {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRF-TOKEN': csrfToken, // Include CSRF token if stored
          },
          withCredentials: true // Include credentials in the request
        });
        
        console.log('Registration response:', response);
        if (response.status === 200 || response.status === 201) {
            localStorage.setItem('shop', JSON.stringify(response.data.data.shop));
            localStorage.setItem('roles', JSON.stringify(response.data.data.roles));
            localStorage.setItem('roles_name', JSON.stringify(response.data.data.rolesName));
            router.push('/profileShop');
        }
    } catch (error: unknown) {
        console.error('Registration error:', error);
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
          setMessage(errorMessage);
        } else {
          setMessage('An unexpected error occurred.');
        }
    }
  };

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
    setFormData({ ...formData, bank_name: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="bg-white p-5 rounded-lg shadow-lg w-full sm:w-[600px]">
        <CardHeader>
          <div className="relative flex items-center justify-center">
            {/* หัวข้อ Shop อยู่ตรงกลาง */}
            <CardTitle className="text-center w-full">Shop</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <Label>Shop Name</Label>
              <Input
                type="text"
                name="shop_name"
                value={formData.shop_name}
                onChange={handleChange}
                placeholder="Shop Name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Bank Name</Label>
                  <Select onValueChange={bankSelect} defaultValue={formData.bank_name}>
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
              </div>

              <div>
                <Label>Account No.</Label>
                <Input
                  type="text"
                  name="bank_number"
                  value={formData.bank_number}
                  onChange={handleChange}
                  placeholder="Account No."
                />
              </div>

              <div>
                <Label>Account Name</Label>
                <Input
                  type="text"
                  name="bank_account"
                  value={formData.bank_account}
                  onChange={handleChange}
                  placeholder="Account Name"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="accepts_custom"
                checked={formData.accepts_custom}
                onChange={handleChange}
              />
              <Label htmlFor="acceptCustomization">
                Accepting customize from customer
              </Label>
            </div>
            {/* แสดงข้อความ error หากมี */}
            {message && (
              <div className="text-red-500 text-sm mt-2">
                {message}
              </div>
            )}
            <CardFooter className="flex justify-between">
              {/* ปุ่มย้อนกลับ */}
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              {/* ปุ่ม Submit */}
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterShop;
