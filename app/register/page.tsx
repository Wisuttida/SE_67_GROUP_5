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

const RegisterPage = () => {
  const router = useRouter();

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
            {/* หัวข้อ Register อยู่ตรงกลาง */}
            <CardTitle className="text-xl">Register</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Name" />
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
            <Input id="password" type="password" placeholder="Password" />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Phone Number" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Email" />
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
