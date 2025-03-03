"use client";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CartButton from "@/components/CartButton"; // Import CartButton
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
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

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
          'X-CSRF-TOKEN': csrfToken, // Include CSRF token if necessary
        },
        withCredentials: true, // Include credentials (cookies) in the request
      });
        if (response.status === 200) {
            // Clear the token from local storage
            localStorage.removeItem('token');
            localStorage.removeItem('csrf');
            localStorage.removeItem('cart');
            localStorage.removeItem('csrfToken');
            localStorage.removeItem('user_data');
            localStorage.removeItem('roles');
            localStorage.removeItem('roles_name');
            // Optionally redirect the user or update the UI
            router.push('/'); // Redirect to login page or home page
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Perfume Thai
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center border rounded-lg px-2">
          <Search className="text-gray-400" size={18} />
          <Input type="text" placeholder="Search products..." className="border-none focus:ring-0" />
        </div>

        {/* Menu */}
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-4">
            <NavigationMenuItem><Link href="/" className="hover:text-gray-600">Home</Link></NavigationMenuItem>
            <NavigationMenuItem><Link href="/product" className="hover:text-gray-600">Product</Link></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-6">
          {/* Cart Button (ใช้ Component ใหม่) */}
          <CartButton />

          {/* ปุ่ม Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Account</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register">Register</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profileShop">Shop Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/registerShop">Register Shop</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ProfileUser">User Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button onClick={handleLogout}>Logout</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
