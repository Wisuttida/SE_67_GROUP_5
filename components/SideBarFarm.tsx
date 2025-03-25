"use client";

import { User, Package, Store } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SideBarFarm() {
  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: "My Profile", href: "/ProfileUser" },
    { icon: <User className="w-5 h-5" />, label: "My Farm", href: "/farm" },
    { icon: <Package className="w-5 h-5" />, label: "Order", href: "/farm/order-post" },
    { icon: <Package className="w-5 h-5" />, label: "To Ship", href: "/farm/to-ship" },
    { icon: <Store className="w-5 h-5" />, label: "Sell Ingredient", href: "/farmHomePost" },
    { icon: <Store className="w-5 h-5" />, label: "Post Ingredient", href: "/farmPost" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md rounded-lg p-6 h-full">
      <nav className="space-y-1">
        {menuItems.map(({ icon, label, href }, index) => (
          <Link href={href} key={index}>
            <Button 
              variant="ghost" 
              className="w-full justify-start flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <span className="text-gray-500">{icon}</span> 
              <span>{label}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
