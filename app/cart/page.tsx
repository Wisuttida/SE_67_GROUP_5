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
    image_url: string | null;
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
  const [selectedShop, setSelectedShop] = useState<string>("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch csrf-token and cart items in parallel
        const [csrfResponse, cartResponse, addressResponse] = await Promise.all([
          axios.get(`http://localhost:8000/csrf-token`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, { withCredentials: true }),
        ]);

        // Set csrf-token
        setCsrfToken(csrfResponse.data.csrf_token);

        // Set cart items
        setCartItems(cartResponse.data.cart_items);

        // Set addresses and select the default one
        const sortedAddresses = addressResponse.data.data.sort(
          (a: any, b: any) => b.is_default - a.is_default
        );
        setAddresses(sortedAddresses);
        if (sortedAddresses.length > 0) {
          setSelectedAddress(sortedAddresses[0].address_id.toString()); // Auto select the first address
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Check if the order was placed and open the dialog
    const orderStatus = localStorage.getItem('orderPlaced');
    if (orderStatus) {
      setOpenDialog(true);
      localStorage.removeItem('orderPlaced'); // Clear the status
    }
  }, []);

  useEffect(() => {
    console.log("✅ Address Selected:", selectedAddress);
  }, [selectedAddress]);
  
  const toggleSelectItem = (productId: number, shopId: number) => {
    // หากเลือกสินค้าจากร้านหนึ่งแล้วไม่ให้เลือกสินค้าจากร้านอื่น
    if (selectedItems.length > 0) {
      const selectedShopId = cartItems.find(item => item.product.product_id === selectedItems[0])?.product.shop.shop_id;
      if (selectedShopId !== shopId) {
        alert("คุณสามารถเลือกสินค้าจากร้านเดียวเท่านั้น");
        return;
      }
    }

    setSelectedItems(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

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

  const calculateTotal = () =>
    cartItems
      .filter(item => selectedItems.includes(item.product.product_id))
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  const handlePlaceOrder = async () => {
    if (selectedItems.length === 0) {
      alert("กรุณาเลือกสินค้าอย่างน้อย 1 รายการ");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/select-item`,
        {
          cart_item_ids: cartItems
            .filter(item => selectedItems.includes(item.product.product_id))
            .map(item => item.cart_item_id),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log("✅ Order placed:", response.data);
      // เก็บ status order ว่าสำเร็จ
      localStorage.setItem('orderPlaced', 'true');
      // Reload หน้าหลังจากสั่งซื้อเสร็จ
      window.location.reload();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Axios Error:", error.response?.data || error.message);
        alert(error.response?.data?.error || error.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
      } else {
        console.error("❌ Unknown Error:", error);
        alert('เกิดข้อผิดพลาด');
      }
    }
  };



  // ดึงชื่อร้านค้าไม่ซ้ำกันจาก cartItems
  const shopList = Array.from(new Set(cartItems.map(item => `${item.product.shop.shop_id}|${item.product.shop.shop_name}`)));

  // Filter cart ตามร้านค้าที่เลือก
  const filteredItems = selectedShop === "all"
    ? cartItems
    : cartItems.filter(item => item.product.shop.shop_id === Number(selectedShop));

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 pb-24">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {/* Address Selection */}
        <div className="flex items-center space-x-4 mb-4">
          <label className="font-semibold">เลือกที่อยู่จัดส่ง:</label>
          <Select value={selectedAddress} onValueChange={setSelectedAddress}>
            <SelectTrigger className="w-full max-w-[1100px]"> {/* Adjust width here */}
              <SelectValue placeholder="เลือกที่อยู่" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((addr) => (
                <SelectItem key={addr.address_id} value={addr.address_id.toString()} className="text-left">
                  {`${addr.fname} ${addr.lname} 
                  | ${addr.house_number} ${addr.building} ${addr.street_name} ต.${addr.tambon} อ.${addr.amphoe} จ.${addr.province} ${addr.zipcode} 
                  | โทร ${addr.phonenumber}`}
                  {addr.is_default === 1 ? ' (ค่าเริ่มต้น)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>

        {/* Filter by Shop */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Filter by Shop</label>
          <Select value={selectedShop} onValueChange={setSelectedShop}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a shop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shops</SelectItem>
              {shopList.map((shopString, index) => {
                const [shopId, shopName] = shopString.split("|");
                return (
                  <SelectItem key={index} value={shopId}>
                    {shopName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            filteredItems.map(item => (
              <div key={item.product.product_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-3 w-5 h-5"
                    checked={selectedItems.includes(item.product.product_id)}
                    onChange={() => toggleSelectItem(item.product.product_id, item.product.shop.shop_id)}
                  />
                  <img
                    src={item.product.image_url || "/path/to/default-image.jpg"}
                    alt={item.product.shop.shop_name}
                    className="w-10 h-10 rounded-lg mr-3"
                  />
                  <div>
                    <h2 className="font-semibold">{item.product.name}</h2>
                    <p className="text-gray-500">Price: ${item.price}</p>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-t z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-xl font-bold">Total: ${calculateTotal()}</h2>
          <Button variant="outline" onClick={handlePlaceOrder}>
            <ShoppingCart size={20} className="mr-2" /> Place Order
          </Button>
        </div>
      </div>

      {/* Order Success Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สั่งสินค้าแล้ว!</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">กรุณาตรวจสอบการชำระเงินที่หน้า To Pay</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
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