"use client";
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import SideBarUser from "@/components/SideBarUser"; // เรียกใช้งาน Sidebar ที่นี่
import axios from 'axios';

// interface ShippingOrder {
//   id: string;
//   shop: string;
//   productName: string;
//   orderDate: string;
//   status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
//   quantity: number;
//   totalPrice: number;
//   image?: string;
// }

interface ShippingOrder {
    order_id: number;
    total_amount: string;
    status: string;
    created_at: string;
    updated_at: string;
    addresses_address_id: number;
    shops_shop_id: number;
    users_user_id: number;
    order_items: [
        {
            order_item_id: number;
            quantity: number;
            price: number;
            created_at: string;
            updated_at: string;
            products_product_id: number;
            orders_order_id: number;
            product: {
                product_id: number;
                name: string;
                description: string;
                price: number;
                volume: number;
                stock_quantity: number;
                image_url: string;
                gender_target: string;
                fragrance_strength: string;
                status: string;
                created_at: string;
                updated_at: string;
                shops_shop_id: number;
                shop: {
                    shop_id: number;
                    shop_name: string;
                    shop_image: string;
                    description: string;
                    accepts_custom: number;
                    bank_name: string;
                    bank_account: string;
                    bank_number: string;
                    is_activate: number;
                    users_user_id: number;
                    addresses_address_id: number;
                }
            }
        }
    ]
}

export default function UserPage() {
  const csrf = localStorage.getItem('csrfToken');
  const token = localStorage.getItem('token');
  const { toast } = useToast();
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ShippingOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const status = "confirmed";
    try {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/status/${status}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrf,
          },
        })
        .then(response => {
          console.log("Data", response.data);

          if (Array.isArray(response.data)) {
            setOrders(response.data);
          } else {
            console.error("ข้อมูลที่ได้รับไม่ใช่ Array:", response.data);
          }

        })
        .catch(error => {
          console.error("Error fetching products:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     setIsLoading(true);
  //     try {
  //       await new Promise(resolve => setTimeout(resolve, 1000));

  //       const mockOrders: ShippingOrder[] = [
  //         { id: 'order-1', shop: 'Shop1', productName: 'Product Name', orderDate: '2023-10-01', status: 'pending', quantity: 2, totalPrice: 1000, image: '/images/product.png' },
  //         { id: 'order-2', shop: 'Shop2', productName: 'Custom Product', orderDate: '2023-10-02', status: 'shipped', quantity: 1, totalPrice: 750, image: '/images/product.png' },
  //       ];

  //       setOrders(mockOrders);
  //       setFilteredOrders(mockOrders);
  //     } catch (error) {
  //       toast("ไม่สามารถดึงข้อมูลรายการสินค้าที่ต้องจัดส่งได้");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchOrders();
  // }, [toast]);

  useEffect(() => {
    const result = orders.filter(order => 
      order.order_items[0].product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_items[0].product.shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(result);
  }, [orders, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar /> {/* เอา Navbar ออกมาที่ด้านบนสุด */}
      
      <div className="flex">
        <div className="w-64">
          <SideBarUser /> {/* เพิ่ม Sidebar */}
        </div>
        <div className="flex-1 p-6">
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

          <div className="mt-8">
            <h1 className="text-2xl font-bold text-center mb-6">รายการที่กำลังจัดส่ง</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOrders.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  {searchQuery ? "ไม่พบรายการที่ค้นหา" : "ไม่มีรายการที่ต้องจัดส่ง"}
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const totalQuantity = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
                  const productNames = order.order_items.map((item) => item.product.name).join(", ");

                  return (
                    <Card key={order.order_id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
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
                          <span className={`text-sm ${order.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                            {/* {order.status} */}
                            กำลังจัดส่ง
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="font-medium">สินค้า: {productNames}</p>
                          <p className="text-gray-600">วันที่สั่งซื้อ: {new Date(order.created_at).toLocaleDateString('th-TH')}</p>
                          <p className="text-gray-600">จำนวนทั้งหมด: {totalQuantity} ชิ้น</p>
                          <p className="text-gray-600">ราคา: ฿{order.total_amount.toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
