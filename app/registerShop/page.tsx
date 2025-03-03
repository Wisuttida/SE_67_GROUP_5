"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

function RegisterShop() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    shopName: "",
    bankName: "",
    accountNo: "",
    accountName: "",
    phoneNumber: "",
    acceptCustomization: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add further logic to send data to your backend
    router.push("/profileShop");
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Shop Name</Label>
              <Input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Shop Name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Bank Name</Label>
                <Input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                />
              </div>

              <div>
                <Label>Account No.</Label>
                <Input
                  type="text"
                  name="accountNo"
                  value={formData.accountNo}
                  onChange={handleChange}
                  placeholder="Account No."
                />
              </div>

              <div>
                <Label>Account Name</Label>
                <Input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="Account Name"
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="acceptCustomization"
                name="acceptCustomization"
                checked={formData.acceptCustomization}
                onChange={handleChange}
              />
              <Label htmlFor="acceptCustomization">
                Accepting customize from customer
              </Label>
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

export default RegisterShop;
