"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

function RegisterFarm() {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState('');
  const [formData, setFormData] = useState({
    'farm_name': "",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/registerFarm`, {
            farm_name: formData.farm_name,
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
            localStorage.setItem('farm', JSON.stringify(response.data.data.farm));
            localStorage.setItem('roles', JSON.stringify(response.data.data.roles));
            localStorage.setItem('roles_name', JSON.stringify(response.data.data.rolesName));
            router.push('/farm');
        }
    } catch (error: any) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        setMessage(errorMessage);
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
  const bankSelect = (value) => {
    setFormData({ ...formData, bank_name: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="bg-white p-5 rounded-lg shadow-lg w-full sm:w-[600px]">
        <CardHeader>
          <div className="relative flex items-center justify-center">
            <CardTitle className="text-center w-full">Farm</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <Label>Farm Name</Label>
              <Input
                type="text"
                name="farm_name"
                value={formData.farm_name}
                onChange={handleChange}
                placeholder="Farm Name"
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

export default RegisterFarm;