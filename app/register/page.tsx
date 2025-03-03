"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import { logger } from '../../lib/logger';

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [phone_number, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/csrf-token');
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(''); // Clear any previous error messages
    console.log('click');
    // Validate password confirmation
    if (password !== passwordConfirmation) {
      setMessage('Passwords do not match');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Invalid email format');
      return;
    }
    
    try {
        if (!csrfToken) {
          setMessage('CSRF token not found. Please refresh the page.');
          setIsLoading(false);
          return;
        }
        console.log('Submitting registration form...');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            first_name,
            last_name,
            username,
            email,
            password,
            password_confirmation: passwordConfirmation,
            phone_number
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
            router.push('/');
        }
    } catch (error: any) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        setMessage(errorMessage);
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full sm:w-96 p-5 shadow-lg">
          <CardHeader>
            <div className="relative flex items-center justify-center">
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
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Name" 
                  value={first_name} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} 
                  required
                />
              </div>
              <div>
                <Label htmlFor="surname">Surname</Label>
                <Input 
                  id="surname" 
                  type="text" 
                  placeholder="Surname" 
                  value={last_name} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} 
                  required
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} 
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pr-10"
                  value={password} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                  required
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
              <Label htmlFor="passwordConfirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={passwordConfirmation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
                  required
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
                value={phone_number} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} 
                required
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
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 items-center">
            <Button className="w-full" type="submit">Register</Button>
            {message && <p className="text-red-500 text-sm">{message}</p>}
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default RegisterPage;
