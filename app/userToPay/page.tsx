"use client";
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import axios from 'axios';
import LoadingPage from '@/components/LoadingPage';

interface PaymentItem {
  id: string;
  shop: {
    name: string;
    avatar: string;
  };
  product: {
    name: string;
    description: string;
    amount: number;
    price: number;
    image: string;
  };
  time: string;
  totalPrice: number;
}

interface Shop {
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
}

interface Product {
  product_id: number;
  name: string;
  description: string | null;
  price: string;
  volume: number;
  stock_quantity: number;
  image_url: string;
  gender_target: string;
  fragrance_strength: string;
  status: string;
  created_at: string;
  updated_at: string;
  shops_shop_id: number;
  shop: Shop;
}

interface OrderItem {
  order_item_id: number;
  quantity: number;
  price: string;
  created_at: string;
  updated_at: string;
  products_product_id: number;
  orders_order_id: number;
  product: Product;
}

interface Order {
  order_id: number;
  total_amount: string;
  status: string;
  created_at: string;
  updated_at: string;
  addresses_address_id: number;
  shops_shop_id: number;
  users_user_id: number;
  order_items: OrderItem[];
}
type OrdersResponse = Order[];

export default function UserToPay() {
  const { toast } = useToast();
  let csrf = localStorage.getItem('csrfToken');
  let token = localStorage.getItem('token');
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrdersResponse>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/userPending`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrf,
      },
      withCredentials: true,
    })
    .then(res => {
      localStorage.setItem('ordersPending', JSON.stringify(res.data));
      setOrders(res.data);
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Error fetching address:", error);
    });
  }, []);

  const toggleExpand = (id: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  if (isLoading) {
    return <LoadingPage />; // Show the spinner while loading
  }

  return (
    <div>
        <Navbar />

        <div className="mt-8">
            <h1 className="text-2xl font-bold text-center mb-6">รายการที่ต้องชำระ</h1>
            
            <div className="space-y-4">
                {orders.map((order) => (
                    order.order_items.map((item) => (
                        <Card key={item.order_item_id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3">
                                            <Image 
                                                src={item.product.shop.shop_image || item.product.image_url}
                                                alt={item.product.shop.shop_name}
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3E?%3C/text%3E%3C/svg%3E";
                                                }}
                                            />
                                        </div>
                                        <span className="font-medium">{item.product.shop.shop_name}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleString('th-TH')}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-24 h-32 bg-gray-100 flex items-center justify-center">
                                        <Image 
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover rounded-lg mb-4"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='100' viewBox='0 0 80 100'%3E%3Crect width='80' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3E?%3C/text%3E%3C/svg%3E";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.product.name}</h3>
                                        <p className="text-gray-600">{item.product.description}</p>
                                        <p className="text-sm text-gray-600">ราคา: ฿{item.price}</p>
                                        <p className="text-sm text-gray-600">จำนวน: {item.quantity}</p>
                                        <p className="font-medium">ราคารวม: ฿{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    className="w-full flex items-center justify-between border-2 border-black-500 text-black"
                                    onClick={() => toggleExpand(String(item.order_item_id))}
                                >
                                    <span>รายละเอียดการชำระเงิน</span>
                                    {isExpanded[item.order_item_id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </Button>

                                {isExpanded[item.order_item_id] && (
                                    <div className="mt-4 space-y-4">
                                        <div className="flex justify-center">
                                            <Image
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1200px-QR_Code_Example.svg.png"
                                                alt="QR Code"
                                                width={200}
                                                height={200}
                                                className="object-contain"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='24'%3EQR Code%3C/text%3E%3C/svg%3E";
                                                }}
                                            />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="font-medium">บัญชีธนาคาร : {item.product.shop.bank_name}</p>
                                            <p>ชื่อบัญชี : {item.product.shop.bank_account}</p>
                                            <p className="font-medium">฿{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                                        </div>
                                        <Link href={`/Payment/${item.order_item_id}`} className="block">
                                            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                                                สั่งซื้อ
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ))}
            </div>
        </div>
    </div>
  );
}