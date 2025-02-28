"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  shopName: string; // เพิ่มชื่อร้านค้า
  shopImage: string; // เพิ่มรูปโปรไฟล์ร้านค้า
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("all"); // เก็บค่าร้านที่เลือก

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

  const toggleSelectItem = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId) // เอาออกถ้าถูกเลือกอยู่
        : [...prev, productId] // เพิ่มเข้าไปถ้ายังไม่ได้เลือก
    );
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    updateCart(updatedCart);
    setSelectedItems(selectedItems.filter((id) => id !== productId)); // เอาออกจากการเลือก
  };

  const increaseQuantity = (productId: number) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (productId: number) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.productId))
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // สร้างรายการร้านค้าทั้งหมด
  const shopList = ["all", ...new Set(cartItems.map((item) => item.shopName))];

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {/* ตัวกรองร้านค้า */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Filter by Shop</label>
          <Select value={selectedShop} onValueChange={setSelectedShop}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a shop" />
            </SelectTrigger>
            <SelectContent>
              {shopList.map((shop) => (
                <SelectItem key={shop} value={shop}>
                  {shop === "all" ? "All Shops" : shop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* รายการสินค้า */}
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems
              .filter((item) => selectedShop === "all" || item.shopName === selectedShop) // กรองตามร้านค้า
              .map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    {/* Checkbox เลือกสินค้า */}
                    <input
                      type="checkbox"
                      className="mr-3 w-5 h-5"
                      checked={selectedItems.includes(item.productId)}
                      onChange={() => toggleSelectItem(item.productId)}
                    />

                    <img src={item.shopImage} alt={item.shopName} className="w-10 h-10 rounded-full mr-3" />

                    <div>
                      <h2 className="font-semibold">{item.name}</h2>
                      <p className="text-gray-500">Price: ${item.price}</p>
                      <p className="text-sm text-gray-600">Shop: {item.shopName}</p>
                    </div>
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

        {/* แสดงปุ่ม Checkout เฉพาะเมื่อมีสินค้าที่ถูกเลือก */}
        {selectedItems.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Total: ${calculateTotal()}</h2>
            <Link href={`/checkout?items=${selectedItems.join(",")}`}> {/* ส่งเฉพาะสินค้าที่เลือกไปที่ checkout */}
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
