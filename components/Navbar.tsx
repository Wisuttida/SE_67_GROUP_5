"use client";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CartButton from "@/components/CartButton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    checkLoginStatus();
    
    // Add event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('csrf');
      localStorage.removeItem('cart');
      localStorage.removeItem('csrfToken');
      localStorage.removeItem('user_data');
      localStorage.removeItem('roles');
      localStorage.removeItem('roles_name');
      
      // Update login state
      setIsLoggedIn(false);
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
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
            <NavigationMenuItem>
              <Link href="/" className="hover:text-gray-600">Home</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/product" className="hover:text-gray-600">Product</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-6">
          <CartButton />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Account</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {!isLoggedIn ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="w-full">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="w-full">Register</Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/ProfileUser" className="w-full">User Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profileShop" className="w-full">Shop Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/registerShop" className="w-full">Register Shop</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/farm" className="w-full">Farm Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/registerFarm" className="w-full">Register Farm</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;