"use client"; // ใช้ Client Component
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50"> {/* ใช้ sticky ที่นี่ */}
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

        <div className="flex items-center gap-6"> {/* เพิ่ม gap ที่นี่ */}
        {/* Cart Button */}
        <Button variant="outline" className="flex items-center space-x-2">
          <ShoppingCart size={20} />
          <span>Cart</span>
        </Button>

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
                <Link href="/ProflieUser">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
