"use client";
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

interface OrderItem {
  id: number;
  shopName: string;
  productName: string;
  description: string;
  amount: number;
  price: number;
  image: string;
}

export default function UserToShip() {
  // สร้างข้อมูลตัวอย่างสำหรับคำสั่งซื้อที่รอการจัดส่ง
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 1,
      shopName: "Shop1",
      productName: "น้ำหอม1",
      description: "A rich and warm fragrance with deep woody notes.",
      amount: 2,
      price: 100,
      image: "/images/product.png"
    },
    {
      id: 2,
      shopName: "Shop2",
      productName: "น้ำหอม2",
      description: "A luxurious blend of agarwood and benzoin.",
      amount: 1,
      price: 75,
      image: "/images/product.png"
    },
    {
      id: 3,
      shopName: "Shop1",
      productName: "น้ำหอม3",
      description: "Fresh citrus notes with a hint of mint.",
      amount: 3,
      price: 150,
      image: "/images/product.png"
    },
    {
      id: 4,
      shopName: "Shop3",
      productName: "น้ำหอม4",
      description: "Floral bouquet with jasmine and rose.",
      amount: 1,
      price: 80,
      image: "/images/product.png"
    },
    {
      id: 5,
      shopName: "Shop2",
      productName: "น้ำหอม5",
      description: "Spicy oriental blend with vanilla and amber.",
      amount: 2,
      price: 120,
      image: "/images/product.png"
    },
    {
      id: 6,
      shopName: "Shop4",
      productName: "น้ำหอม6",
      description: "Light and refreshing aquatic scent.",
      amount: 1,
      price: 65,
      image: "/images/product.png"
    }
  ]);

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* Navbar */}
      <Navbar />
      
      {/* Page Header */}
      <div className="flex justify-center py-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold">รายการสินค้าที่รอจัดส่ง</h2>
      </div>
      
      {/* Order Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        {orders.map((order) => (
          <Card key={order.id} className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 flex flex-col">
              {/* Shop Info */}
              <div className="flex items-center mb-4 pb-2 border-b">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                  <Image
                    src="/avatar.png"
                    alt="Shop Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <p className="font-semibold">{order.shopName}</p>
              </div>
              
              {/* Product Info */}
              <div className="flex mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mr-4">
                  <Image
                    src={order.image}
                    alt="Product Image"
                    width={80}
                    height={80}
                  />
                </div>
                <div>
                  <p className="font-medium text-lg">{order.productName}</p>
                  <p className="text-gray-600 text-sm line-clamp-2">{order.description}</p>
                </div>
              </div>
              
              {/* Order Details */}
              <div className="mt-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>จำนวน:</span>
                  <span>{order.amount} ชิ้น</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>ราคารวม:</span>
                  <span>฿{(order.price * order.amount).toFixed(2)}</span>
                </div>
                
                {/* Shipping Status */}
                <div className="mt-4 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-600 font-medium">รอการจัดส่ง</span>
                    <Link href={`/trackOrder/${order.id}`}>
                      <Button variant="outline" size="sm">
                        ติดตามสถานะ
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Empty State */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 mb-4 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-xl font-medium mb-2">ไม่มีรายการที่รอจัดส่ง</h3>
          <p className="text-gray-500 mb-6">คุณไม่มีรายการสั่งซื้อที่รอการจัดส่งในขณะนี้</p>
          <Link href="/product">
            <Button>
              เลือกซื้อสินค้า
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}