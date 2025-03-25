"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import { useState, useEffect } from 'react';

axios.defaults.withCredentials = true;

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Invalid email format');
      setIsLoading(false);
      return;
    }
    
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;
        console.log('Attempting login to:', apiUrl);

        if (!csrfToken) {
            setMessage('CSRF token not found. Please refresh the page.');
            setIsLoading(false);
            return;
        }
        
        // Then make login request
        const response = await axios.post(apiUrl, 
          { email, password },
          { 
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRF-TOKEN': csrfToken, // Include the CSRF token here
              withCredentials: true,
            }
          }
        );

        console.log('Server response:', {
          status: response.status,
          data: response.data,
        });
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
          headers: {
            'Authorization': `Bearer ${response.data.data.token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
        })
        .then(res => {
          localStorage.setItem('addresses', JSON.stringify(res.data.data));
          router.push('/ProfileUser');
        })
        .catch(error => {
          console.error("Error fetching address:", error);
        });

        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user_data', JSON.stringify(response.data.data.user)); // Store user data
            localStorage.setItem('csrfToken', csrfToken);
            localStorage.setItem('roles', JSON.stringify(response.data.data.roles));
            localStorage.setItem('roles_name', JSON.stringify(response.data.data.rolesName));
            localStorage.setItem('shop', JSON.stringify(response.data.data.shop[0]));
            localStorage.setItem('farm', JSON.stringify(response.data.data.farm[0]));
            console.log('Token stored successfully');
        } else {
            console.warn('No token in response:', response.data);
            setMessage('Login successful but no token received. Please try again.');
        }
    } catch (error: any) {
        console.error('Login error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        if (error.response) {
            setMessage(error.response.data?.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
            setMessage('Unable to reach the server. Please check your connection.');
        } else {
            setMessage('An error occurred. Please try again.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput) && emailInput !== '') {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full sm:w-96 p-5 shadow-lg">
          <CardHeader>
            <div className="relative flex items-center justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="absolute left-0"
              >
                <ArrowLeft size={24} />
              </Button>
              <CardTitle className="text-xl">Login</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {message && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {message}
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className={`${emailError ? "border-red-500" : ""}`}
                required
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
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
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button 
              className="w-full" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Register
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default LoginPage;
