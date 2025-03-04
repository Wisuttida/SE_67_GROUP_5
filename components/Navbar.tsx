"use client";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Perfume Thai
        </Link>

        <div className="hidden md:flex items-center border rounded-lg px-2">
          <Search className="text-gray-400" size={18} />
          <Input 
            type="text" 
            placeholder="Search products..." 
            className="border-none focus:ring-0" 
          />
        </div>

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

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Account</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isLoggedIn ? (
                <>
                  <DropdownMenuItem>
                    <Link href="/login" className="w-full">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/register" className="w-full">Register</Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link href="/ProfileUser" className="w-full">User Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profileShop" className="w-full">Shop Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/registerShop" className="w-full">Register Shop</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/farm" className="w-full">Farm Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/registerFarm" className="w-full">Register Farm</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
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