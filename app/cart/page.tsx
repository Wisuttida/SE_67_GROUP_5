"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
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
} from "@/components/ui/dialog";

interface Cart {
  cart_item_id: number;
  price: number;
  stock_quantity: number;
  quantity: number;
  product: {
    product_id: number;
    name: string;
    shop: {
      shop_id: number;
      shop_name: string;
      shop_image: string | null;
    };
  };
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("all"); // ใช้เป็น string เท่านั้น
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // ดึง CSRF Token + ข้อมูลสินค้าจากตะกร้า
  useEffect(() => {
    const fetchData = async () => {
      try {
        const csrf = await axios.get(`http://localhost:8000/csrf-token`, { withCredentials: true });
        setCsrfToken(csrf.data.csrf_token);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, { withCredentials: true });
        setCartItems(response.data.cart_items);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    const fetchItemsByShop = async (shopId: number) => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/items/shop/${shopId}`,
          { withCredentials: true }
        );
        setCartItems(response.data.cart_items);
      } catch (error) {
        console.error("❌ Error fetching items by shop:", error);
      }
    };

    if (selectedShop !== "all") {
      fetchItemsByShop(Number(selectedShop)); // แปลง selectedShop เป็นตัวเลข
    } else {
      fetchData();
    }
  }, [selectedShop]);

  // เลือกสินค้า
  const toggleSelectItem = (productId: number) => {
    setSelectedItems(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // ลบสินค้าออกจากตะกร้า
  const removeItemFromCart = async (cart_item_id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove/${cart_item_id}`, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      setCartItems(prev => prev.filter(item => item.cart_item_id !== cart_item_id));
      setSelectedItems(prev => prev.filter(id => id !== cart_item_id));

      console.log("✅ ลบสินค้าออกจากตะกร้าแล้ว");
    } catch (error: any) {
      console.error("❌ Error removing item:", error.response?.data || error.message);
      alert(error.response?.data?.error || 'เกิดข้อผิดพลาดในการลบสินค้า');
    }
  };

  // อัปเดตจำนวนสินค้า
  const updateQuantity = async (cart_item_id: number, newQty: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.cart_item_id === cart_item_id ? { ...item, quantity: newQty } : item
      )
    );

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/update/${cart_item_id}`,
        { quantity: newQty },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
        }
      );
      console.log('✅ Quantity updated');
    } catch (error: any) {
      console.error("❌ Error updating cart:", error.response?.data || error.message);
      alert(error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า');
    }
  };

  // คำนวณยอดรวม
  const calculateTotal = () =>
    cartItems
      .filter(item => selectedItems.includes(item.product.product_id))
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  // สั่งซื้อ
  const handlePlaceOrder = () => {
    if (selectedItems.length === 0) return;
    
    setOrderSuccess(true);
    setSelectedItems([]);
  };
  // รายชื่อร้านค้า
  const shopList = ["all", ...new Set(cartItems.map(item => item.product.shop.shop_id))];

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 pb-24">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {/* Filter by Shop */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Filter by Shop</label>
          <Select value={selectedShop} onValueChange={setSelectedShop}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a shop" />
            </SelectTrigger>
            <SelectContent>
              {shopList.map((shopId, index) => {
                const shop = cartItems.find(item => item.product.shop.shop_id === Number(shopId))?.product.shop;
                return (
                  <SelectItem key={index} value={String(shopId)}>
                    {shopId === "all" ? "All Shops" : shop?.shop_name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems
              .filter(item => selectedShop === "all" || item.product.shop.shop_id === Number(selectedShop)) // แปลง selectedShop เป็นตัวเลขในการกรอง
              .map(item => (
                <div key={item.product.product_id} className="flex items-center justify-between p-4 border rounded-lg">
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
                      <h2 className="font-semibold">{item.product.name}</h2>
                      <p className="text-gray-500">Price: ฿{item.price}</p>
                      <p className="text-sm text-gray-600">Shop: {item.product.shop.shop_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
                    <span>{item.quantity}</span>
                    <Button variant="outline" onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}>+</Button>
                    <Button variant="outline" onClick={() => removeItemFromCart(item.cart_item_id)}>Remove</Button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Total & Place Order */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-t z-50">
          <div className="container mx-auto flex justify-between items-center">
            <h2 className="text-xl font-bold">Total: ฿{calculateTotal()}</h2>
            <Button variant="outline" onClick={handlePlaceOrder}>
              <ShoppingCart size={20} className="mr-2" /> Place Order
            </Button>
          </div>
        </div>
      )}

      {/* Order Success Dialog */}
      <Dialog open={orderSuccess} onOpenChange={setOrderSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สั่งสินค้าแล้ว!</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">กรุณาตรวจสอบการชำระเงินที่หน้า To Pay</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderSuccess(true)}>OK</Button>
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
