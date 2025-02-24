"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import React from 'react'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function RegisterPage() {
    const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

    <Card className="bg-white p-5 rounded-lg shadow-lg w-full sm:w-96">
    <CardHeader>
        <CardTitle className="flex justify-between items-center mb-6">
            Register

          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Go Back
          </Button>
        </CardTitle>
    </CardHeader>
    <CardContent >
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div>
            <Label>Name</Label>
            <Input type="name" placeholder="Name"/>
          </div>
          
          <div>
            <Label>Surname</Label>
            <Input type="surname" placeholder="Surname"/>
          </div>
        </div>
        
        <div>
          <Label>Username</Label>
          <Input type="username" placeholder="Username"/>
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="Password" />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input type="phonenumber" placeholder="Phone Number"/>
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="Email"/>
        </div>

      </div>
    </CardContent>
    <CardFooter className="flex justify-center">
        <Button>Register</Button>
    </CardFooter>
    </Card>

    </div>
  )
}

export default RegisterPage;