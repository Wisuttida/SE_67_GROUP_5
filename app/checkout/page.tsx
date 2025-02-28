"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

interface Product {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = () => {
    if (!formData.fullName || !formData.address || !formData.phone) {
      alert("Please fill in all fields.");
      return;
    }

    // จำลองการสั่งซื้อ
    console.log("Order Details:", {
      customer: formData,
      items: cartItems,
      total: calculateTotal(),
    });

    // เคลียร์ตะกร้าหลังจาก Checkout
    localStorage.removeItem("cart");
    setCartItems([]);
    window.dispatchEvent(new Event("storage")); // แจ้งให้ Navbar อัปเดต

    alert("Order placed successfully!");
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* รายการสินค้า */}
        <div className="border p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between items-center p-2 border-b">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
          {cartItems.length > 0 && (
            <h2 className="text-xl font-bold mt-4">Total: ${calculateTotal()}</h2>
          )}
        </div>

        {/* แบบฟอร์มจัดส่ง */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <Input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
            <Input type="text" name="address" placeholder="Shipping Address" value={formData.address} onChange={handleChange} />
            <Input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          </div>
          <Button className="mt-6 w-full" onClick={handleCheckout} disabled={cartItems.length === 0}>
            Confirm Order
          </Button>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
