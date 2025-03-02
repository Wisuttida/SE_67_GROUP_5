"use client";

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
import { ArrowLeft } from "lucide-react";
import axios from 'axios';
import { useEffect, useState } from 'react';

const LoginPage = () => {
  const router = useRouter();
  const handleLogin = () => {
    // นำทางไปยังหน้า dashboard หลังจากกด Login
    router.push("/ProfileUser");
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
            {/* หัวข้อ Login อยู่ตรงกลาง */}
            <CardTitle className="text-xl">Login</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleLogin}>Login</Button>
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </CardFooter>

      </Card>
    </div>
  );
};

export default LoginPage;
