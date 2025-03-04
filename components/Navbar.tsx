"use client";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import  CartButton  from "@/components/CartButton";
import SearchBar from "./SearchBar";
import axios from 'axios';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasShop, setHasShop] = useState(false);
  const [hasFarm, setHasFarm] = useState(false);
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    const shopGet = localStorage.getItem('shop');
    if(shopGet) {
      const shop = JSON.parse(shopGet);
      if (shop.shop_id) {
        setHasShop(true);
      }
    }
    const farmGet = localStorage.getItem('farm');
    if(farmGet) {
      const farm = JSON.parse(farmGet);
      if (farm.farm_id) {
        setHasFarm(true);
      }
    }
  }, []);
  
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'X-CSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });
      
      if (response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        localStorage.removeItem('csrfToken');
        localStorage.removeItem('user_data');
        localStorage.removeItem('roles');
        localStorage.removeItem('roles_name');
        localStorage.removeItem('shop');
        localStorage.removeItem('farm');
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Perfume Thai
        </Link>

        <SearchBar/>

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
          {!isLoggedIn ? (
            <></>
          ):(
            <CartButton/>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Account</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                  {!isLoggedIn && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/login">Login</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/register">Register</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {isLoggedIn && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/ProfileUser">User Profile</Link>
                      </DropdownMenuItem>
                      {hasShop && (
                        <DropdownMenuItem asChild>
                          <Link href="/profileShop">Shop Profile</Link>
                        </DropdownMenuItem>
                      )}
                      {!hasShop && (
                        <DropdownMenuItem asChild>
                          <Link href="/registerShop">Register Shop</Link>
                        </DropdownMenuItem>
                      )}
                      {hasFarm && (
                      <DropdownMenuItem asChild>
                        <Link href="/farm">Farm Profile</Link>
                      </DropdownMenuItem>
                      )}
                      {!hasFarm && (
                      <DropdownMenuItem asChild>
                        <Link href="/registerFarm">Register Farm</Link>
                      </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <button onClick={handleLogout} className="w-full text-left">
                          Logout
                        </button>
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