"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // ✅ ใช้ Dialog จาก ShadCN UI
import axios from "axios";

interface Cart {
  price: number;
  stock_quantity: number;
  quantity: number;
  product: { 
    product_id: number; 
    name: string; 
    shop: {
      shop_name: string;
      shop_image: string | null;
    }};
}


const CartPage = () => {
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("all");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // ✅ ดึงสินค้าจาก Backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {

        await axios.get('http://localhost:8000/csrf-token', { withCredentials: true });

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, { withCredentials: true })
        .then((response) => {
          console.log(response.data.cart_items); // ตรวจสอบข้อมูลที่ได้จาก API
          setCartItems(response.data.cart_items);
        });
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const updateCart = (updatedCart: Cart[]) => {
    setCartItems(updatedCart);
  };

  const toggleSelectItem = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cartItems.filter(
      (item) => item.product.product_id !== productId
    );
    updateCart(updatedCart);
    setSelectedItems(selectedItems.filter((id) => id !== productId));
  };

  const increaseQuantity = (productId: number) => {
    const updatedCart = cartItems.map((item) =>
      item.product.product_id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (productId: number) => {
    const updatedCart = cartItems.map((item) =>
      item.product.product_id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.product.product_id))
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handlePlaceOrder = () => {
    if (selectedItems.length === 0) return;
    setOrderSuccess(true);
    setSelectedItems([]);
  };

  const shopList = ["all", ...new Set(cartItems.map((item) => item.product.shop.shop_name).filter(Boolean))];

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 pb-24">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Filter by Shop
          </label>
          <Select value={selectedShop} onValueChange={setSelectedShop}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a shop" />
            </SelectTrigger>
            <SelectContent>
              {shopList.map((shop, index) => (
                <SelectItem key={shop ? shop : `shop-${index}`} value={shop}>
                  {shop === "all" ? "All Shops" : shop}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
        </div>

        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems
              .filter((item) => selectedShop === "all" || item.product.shop.shop_name === selectedShop)
              .map((item, index) => (
                <div key={item.product.product_id ?? `product-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-3 w-5 h-5"
                      checked={selectedItems.includes(item.product.product_id)}
                      onChange={() => toggleSelectItem(item.product.product_id)}
                    />

                    <img
                      src={item.product.shop.shop_image || "/path/to/default-image.jpg"}
                      alt={item.product.shop.shop_name}
                      className="w-10 h-10 rounded-full mr-3"
                    />

                    <div>
                      {/* แสดงชื่อสินค้า */}
                      <h2 className="font-semibold">{item.product.name}</h2>
                      <p className="text-gray-500">Price: ${item.price}</p>
                      <p className="text-sm text-gray-600">
                        Shop: {item.product.shop.shop_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => decreaseQuantity(item.product.product_id)}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      onClick={() => increaseQuantity(item.product.product_id)}
                    >
                      +
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeFromCart(item.product.product_id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>

      </div>

      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-t z-50">
          <div className="container mx-auto flex justify-between items-center">
            <h2 className="text-xl font-bold">Total: ${calculateTotal()}</h2>
            <Button variant="outline" onClick={handlePlaceOrder}>
              <ShoppingCart size={20} />
              Place Order
            </Button>
          </div>
        </div>
      )}

      {/* ✅ Dialog แจ้งเตือน */}
      <Dialog open={orderSuccess} onOpenChange={setOrderSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สั่งสินค้าแล้ว!</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">กรุณาตรวจสอบการชำระเงินที่ To Pay</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderSuccess(false)}>
              OK
            </Button>
            <Link href="/userToPay">
              <Button>ไปหน้า To Pay</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartPage;
