"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface Product {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const updateCart = (updatedCart: Product[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    updateCart(updatedCart);
  };

  const increaseQuantity = (productId: number) => {
    const updatedCart = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (productId: number) => {
    const updatedCart = cartItems.map(item =>
      item.productId === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-500">Price: ${item.price}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={() => decreaseQuantity(item.productId)}>-</Button>
                  <span>{item.quantity}</span>
                  <Button variant="outline" onClick={() => increaseQuantity(item.productId)}>+</Button>
                  <Button variant="outline" onClick={() => removeFromCart(item.productId)}>Remove</Button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Total: ${calculateTotal()}</h2>
          <Link href="/checkout"> {/* ลิงก์ไปที่หน้า Checkout */}
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingCart size={20} />
              Checkout
            </Button>
          </Link>
        </div>
      )}

      </div>
    </>
  );
};

export default CartPage;
