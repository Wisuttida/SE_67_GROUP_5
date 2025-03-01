"use client";

import React, { useState } from "react";
import {Card,CardContent,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleEmailChange = (e: { target: { value: any; }; }) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    // ตรวจสอบรูปแบบอีเมลด้วย regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError("Email ไม่ถูกต้อง");
    } else {
      setEmailError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full sm:w-96 p-5 shadow-lg">
        <CardHeader>
          <div className="relative flex items-center justify-center">
            {/* ปุ่มย้อนกลับ */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="absolute left-0"
            >
              <ArrowLeft size={24} />
            </Button>
            <CardTitle className="text-xl">Register</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Name"/>
            </div>
            <div>
              <Label htmlFor="surname">Surname</Label>
              <Input id="surname" type="text" placeholder="Surname" />
            </div>
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="Username" />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 flex items-center"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Phone Number" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className={`${emailError ? "border-red-500" : ""}`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button className="w-full">Register</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
