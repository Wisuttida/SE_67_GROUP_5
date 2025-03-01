"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const CartButton = () => {
  return (
    <Link href="/cart">
      <Button variant="outline" className="flex items-center space-x-2">
        <ShoppingCart size={20} />
        <span>Cart</span>
      </Button>
    </Link>
  );
};

export default CartButton;
