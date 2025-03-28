"use client";
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SideBarUser from "@/components/SideBarUser";
import axios from 'axios';

interface Order {
  order_id: number;
  total_amount: string;
  status: string;
  created_at: string;
  updated_at: string;
  addresses_address_id: number;
  shops_shop_id: number;
  order_items: {
    order_item_id: number;
    quantity: number;
    price: string;
    products_product_id: number;
    product: {
      product_id: number;
      name: string;
      description: string;
      price: string;
      volume: number;
      stock_quantity: number;
      image_url: string;
      gender_target: string;
      fragrance_strength: string;
      status: string;
      created_at: string;
      updated_at: string;
      shop: {
        shop_id: number;
        shop_name: string;
        shop_image: string | null;
        description: string;
        accepts_custom: number;
        bank_name: string;
        bank_account: string;
        bank_number: string;
        is_activate: number;
        users_user_id: number;
        addresses_address_id: number;
      };
    };
  }[];
}

export default function UserOrder() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("pending"); // Default to "pending"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [csrfResponse] = await Promise.all([axios.get(`http://localhost:8000/csrf-token`, { withCredentials: true })]);
        setCsrfToken(csrfResponse.data.csrf_token);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!csrfToken) return;
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/list`, {
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
          },
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [csrfToken]);

  const filteredOrders = orders.filter(order =>
    order.status === statusFilter && (
      order.order_items.some(item =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  );

  const handleToggleOrderItems = (orderId: number) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกรายการนี้?')) return;
    setIsLoading(true);
    try {
      setOrders(prev => prev.filter(order => order.order_id !== orderId));
      toast("ยกเลิกรายการสำเร็จ");
    } catch (error) {
      toast("เกิดข้อผิดพลาดในการยกเลิกรายการ");
    } finally {
      setIsLoading(false);
    }
  };
  const proofImage = "/path/to/your/default/proof-image.jpg"; // เปลี่ยนเป็นเส้นทางของรูปภาพที่ต้องการให้แสดง


  return (
    <div>
      <Navbar />

      {/* Sidebar and Orders Section */}
      <div className="flex justify-between mt-6">
        <SideBarUser />

        <div className="w-full max-w-7xl mx-auto mt-8">
          {/* Search Box and Status Filter */}
          <div className="flex justify-between items-center mb-6">
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

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ml-4 p-2 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="canceled">Canceled</option>
              {/* Add other statuses here */}
            </select>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">รายการสั่งซื้อ</h1>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredOrders.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-gray-500">
                {searchQuery ? "ไม่พบรายการที่ค้นหา" : "ไม่มีรายการสั่งซื้อ"}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.order_id} className="max-w-[400px] w-full mx-auto overflow-hidden shadow-sm border rounded-lg">
                  <CardContent className="p-4">
                    {/* ร้านค้า */}
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                        <Image
                          src={order.order_items[0].product.shop.shop_image || '/profile-placeholder.png'}
                          alt="Shop Profile"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">{order.order_items[0].product.shop.shop_name}</span>
                    </div>

                    {/* สินค้าและรายละเอียด */}
                    <div className="flex items-start gap-4">
                      {/* ส่วนของรูปภาพสินค้า */}
                      <div className="w-28 h-36 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <Image
                          src={order.order_items[0].product.image_url || '/images/product.png'}
                          alt={order.order_items[0].product.name}
                          width={80}
                          height={120}
                          className="object-contain"
                        />
                      </div>

                      {/* ส่วนของรายละเอียดสินค้า */}
                      <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-semibold text-base">{order.order_items[0].product.name}</p>
                        <p className="text-gray-600 text-sm mt-1">ราคา: ฿ {order.total_amount}</p>
                        <p className="text-sm text-gray-500 mt-1">สถานะ: {order.status}</p>
                        <p className="text-sm text-gray-500 mt-1">วันที่สั่งซื้อ: {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>

                      {/* การแสดงหลักฐานการโอน */}
                      {proofImage && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-center">หลักฐานการโอน:</h3>
                          <div className="flex justify-center mt-2">
                            <Image
                              src={proofImage}
                              alt="Proof of Payment"
                              width={200}
                              height={200}
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )}

                      {/* ปุ่มแสดง/ซ่อนสินค้า */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 self-start"
                        onClick={() => handleToggleOrderItems(order.order_id)}
                      >
                        {expandedOrderId === order.order_id ? "ซ่อนสินค้า" : "แสดงสินค้าทั้งหมด"}
                      </Button>

                      {/* ปุ่มยกเลิกการสั่งซื้อ */}
                      {order.status !== 'canceled' && order.status !== 'confirmed' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-2 self-start"
                          onClick={() => handleCancelOrder(order.order_id)}
                        >
                          ยกเลิกการสั่งซื้อ
                        </Button>
                      )}
                    </div>

                    </div>


                    {/* รายการสินค้าทั้งหมด */}
                    {expandedOrderId === order.order_id && (
                      <div className="mt-4 border-t pt-4 space-y-3">
                        {order.order_items.map((item) => (
                          <div key={item.order_item_id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Image
                                src={item.product.image_url || '/images/product.png'}
                                alt={item.product.name}
                                width={40}
                                height={60}
                                className="object-contain"
                              />
                              <span className="text-sm">{item.product.name} x {item.quantity}</span>
                            </div>
                            <span className="text-sm">฿ {item.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
