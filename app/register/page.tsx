"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Registration fields (Step 1)
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Address fields (Step 2)
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateAddress, setStateAddress] = useState("");
  const [zip, setZip] = useState("");

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError("Email ไม่ถูกต้อง");
    } else {
      setEmailError("");
    }
  };

  const handleNext = () => {
    // สามารถเพิ่ม validation สำหรับข้อมูลส่วนตัวได้ที่นี่
    setShowAddressForm(true);
  };

  const handleRegister = () => {
    // ตรวจสอบให้แน่ใจว่าข้อมูลที่อยู่ถูกกรอกครบถ้วน
    if (!street || !city || !stateAddress || !zip) {
      alert("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      return;
    }

    // จำลองการลงทะเบียน
    console.log("Registration Details:", {
      name,
      surname,
      username,
      password,
      phone,
      email,
      address: { street, city, state: stateAddress, zip },
    });
    alert("ลงทะเบียนเรียบร้อยแล้ว");
    router.push("/");
  };

  const handleBack = () => {
    if (showAddressForm) {
      setShowAddressForm(false);
    } else {
      router.back();
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
              onClick={handleBack}
              className="absolute left-0"
            >
              <ArrowLeft size={24} />
            </Button>
            <CardTitle className="text-xl">
              {showAddressForm ? "Enter Address" : "Register"}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step 1: Registration Fields */}
          {!showAddressForm && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="surname">Surname</Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
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
            </>
          )}

          {/* Step 2: Address Fields */}
          {showAddressForm && (
            <>
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  type="text"
                  placeholder="Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="State"
                  value={stateAddress}
                  onChange={(e) => setStateAddress(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input
                  id="zip"
                  type="text"
                  placeholder="Zip Code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {showAddressForm ? (
            <Button className="w-full" onClick={handleRegister}>
              Register
            </Button>
          ) : (
            <Button className="w-full" onClick={handleNext}>
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
