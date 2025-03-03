"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

interface FormData {
  farmName: string;
  accountNo: string;
  bankName: string;
  accountName: string;
  phoneNumber: string;
}

interface FormErrors {
  farmName: string;
  accountNo: string;
  bankName: string;
  accountName: string;
  phoneNumber: string;
}

export default function RegisterFarm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    farmName: '',
    accountNo: '',
    bankName: '',
    accountName: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    farmName: '',
    accountNo: '',
    bankName: '',
    accountName: '',
    phoneNumber: ''
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validate farm name
    if (!formData.farmName.trim()) {
      newErrors.farmName = 'กรุณากรอกชื่อฟาร์ม';
      valid = false;
    }

    // Validate account number
    if (!formData.accountNo.trim()) {
      newErrors.accountNo = 'กรุณากรอกเลขบัญชี';
      valid = false;
    } else if (!/^[0-9]{10}$/.test(formData.accountNo)) {
      newErrors.accountNo = 'เลขบัญชีต้องเป็นตัวเลข 10 หลัก';
      valid = false;
    }

    // Validate bank name
    if (!formData.bankName.trim()) {
      newErrors.bankName = 'กรุณากรอกชื่อธนาคาร';
      valid = false;
    }

    // Validate account name
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'กรุณากรอกชื่อบัญชี';
      valid = false;
    }

    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'กรุณากรอกเบอร์โทรศัพท์';
      valid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Reset any existing errors
    setErrors({
      farmName: '',
      accountNo: '',
      bankName: '',
      accountName: '',
      phoneNumber: ''
    });
  
    // Validate form
    if (!validateForm()) {
      return;
    }
  
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Show success message
      toast("ลงทะเบียนฟาร์มสำเร็จ");
  
      // Reset form
      setFormData({
        farmName: '',
        accountNo: '',
        bankName: '',
        accountName: '',
        phoneNumber: ''
      });
  
      // Navigate after a short delay
      setTimeout(() => {
        router.push('/farm');
      }, 1500);
  
    } catch (error) {
      toast("ไม่สามารถลงทะเบียนฟาร์มได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-md mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold text-center mb-6">Farmer</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="farmName">Farm Name</Label>
                <Input
                  id="farmName"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="Farm Name"
                  className={errors.farmName ? 'border-red-500' : ''}
                />
                {errors.farmName && (
                  <p className="text-red-500 text-xs mt-1">{errors.farmName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="accountNo">Account No.</Label>
                <Input
                  id="accountNo"
                  name="accountNo"
                  value={formData.accountNo}
                  onChange={handleChange}
                  placeholder="Account No."
                  className={errors.accountNo ? 'border-red-500' : ''}
                />
                {errors.accountNo && (
                  <p className="text-red-500 text-xs mt-1">{errors.accountNo}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                  className={errors.bankName ? 'border-red-500' : ''}
                />
                {errors.bankName && (
                  <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="Account Name"
                  className={errors.accountName ? 'border-red-500' : ''}
                />
                {errors.accountName && (
                  <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}