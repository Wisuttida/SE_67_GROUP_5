"use client";

// app/cart/page.tsx หรือ pages/cart.tsx ขึ้นอยู่กับโครงสร้างที่ใช้
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

import Navbar from "@/components/Navbar";

const CartPage = () => {
  // สร้างสถานะสินค้าในตะกร้า
  const [cartItems, setCartItems] = useState([
    { productId: 1, name: "Perfume A", price: 99.99, quantity: 1 },
    { productId: 2, name: "Perfume B", price: 149.99, quantity: 1 },
  ]);

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const increaseQuantity = (productId: number) => {
    setCartItems(cartItems.map(item => 
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (productId: number) => {
    setCartItems(cartItems.map(item => 
      item.productId === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
      <><Navbar /><div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* รายการสินค้าในตะกร้า */}
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

      {/* Total */}
      {cartItems.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Total: ${calculateTotal()}</h2>
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart size={20} />
            Checkout
          </Button>
        </div>
      )}
    </div></>
  );
};

export default CartPage;
