"use client";
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SideBarUser from "@/components/SideBarUser"; 
import axios from 'axios';

interface Order {
  order_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: any[];
  shop: {
    shop_image?: string;
    shop_name: string;
  };
}

export default function UserToReceive() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';  // CSRF Token from meta tag
        const token = localStorage.getItem('token'); // Bearer token from localStorage
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/shipped`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,  // Include CSRF token in headers
          },withCredentials: true,
        });

        console.log("Response:", response.data);

        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error("Data received is not an array:", response.data);
        }

        // if (response.ok) {
        //   const data = await response.json();
        //   setOrders(data);
        // } else {
        //   toast("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
        // }
      } catch (error) {
        toast("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order =>
    order.order_items.some(item =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Handle marking order as received
  const handleMarkAsReceived = async (orderId: string) => {
    setIsLoading(true);
    try {
      // Get CSRF token from meta tag
      const csrfToken = localStorage.getItem('csrfToken');

      const token = localStorage.getItem('token'); // Bearer token from localStorage
  
      console.log("CSRF Token:", csrfToken);
      console.log("Bearer Token:", token);
  
      // Ensure both tokens are available
      if (!token || !csrfToken) {
        throw new Error("Missing authentication or CSRF token");
      }
  
      // Make PUT request using axios
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/mark-delivered`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Bearer token
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // CSRF token
          },
          withCredentials: true, // Ensure cookies (CSRF) are sent
        }
      );
  
      if (response.status === 200) {
        toast("ยืนยันการรับสินค้าเรียบร้อยแล้ว");
        setOrders((prev) =>
          prev.map((order) =>
            order.order_id === orderId ? { ...order, status: 'received' } : order
          )
        );
      } else {
        toast(response.data.error || "เกิดข้อผิดพลาดในการยืนยันการรับสินค้า");
      }
    } catch (error) {
      toast("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      console.error("Error marking order as received:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div>
      <Navbar /> {/* Navbar at the top */}

      <div className="flex">
        <div className="w-64">
          <SideBarUser /> {/* Sidebar */}
        </div>
        <div className="flex-1 p-6">
          {/* Search Bar */}
          <div className="flex justify-between items-center mt-6">
            <div className="relative w-full max-w-md mx-auto">
              <Input
                type="text"
                placeholder="ค้นหารายการ..."
                className="w-full px-4 py-2 rounded-full bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              >
                <Search className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-center mb-6">รายการที่ต้องได้รับ</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOrders.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  {searchQuery ? "ไม่พบรายการที่ค้นหา" : "ไม่มีรายการที่ต้องได้รับ"}
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.order_id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                            <Image
                              src={order.shop?.shop_image || '/default-shop-image.jpg'} // Fallback to a default image
                              alt={order.shop?.shop_name || 'Shop'}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium">{order.shop?.shop_name || 'Shop'}</span>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'received' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status === 'received' ? 'ได้รับแล้ว' : 'รอรับสินค้า'}
                          </span>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="w-1/3 flex justify-center items-center">
                          <div className="w-24 h-32 bg-gray-100 flex items-center justify-center">
                            <Image
                              src={order.order_items[0]?.product.image_url || '/default-product-image.jpg'} // Fallback to default product image
                              alt={order.order_items[0]?.product.name || 'Product'}
                              width={60}
                              height={100}
                              className="object-contain"
                            />
                          </div>
                        </div>

                        <div className="w-2/3 pl-4">
                          <h3 className="font-medium">{order.order_items[0]?.product.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{order.order_items[0]?.product.description}</p>
                          <p className="text-sm text-gray-600">จำนวน: {order.order_items.length} ชิ้น</p>
                          <p className="text-sm text-gray-600">ราคารวม: ฿{order.total_amount.toLocaleString()}</p>

                          {order.status !== 'received' && (
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleMarkAsReceived(order.order_id)}
                              disabled={isLoading}
                            >
                              {isLoading ? 'กำลังดำเนินการ...' : 'ยืนยันการรับสินค้า'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
