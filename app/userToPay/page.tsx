"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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

export default function UserToPay() {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({});
  
  const [payments] = useState<PaymentItem[]>([
    {
      id: '1',
      shop: {
        name: 'Shop1',
        avatar: '/profile-placeholder.png'
      },
      product: {
        name: 'Product Name',
        description: 'Description',
        amount: 1,
        price: 500,
        image: '/product-placeholder.png'
      },
      time: new Date().toISOString(),
      totalPrice: 500
    }
  ]);

  const toggleExpand = (id: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <Navbar />

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-center mb-6">รายการที่ต้องชำระ</h1>
        
        <div className="space-y-4">
          {payments.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3">
                      <Image 
                        src={item.shop.avatar}
                        alt={item.shop.name}
                        width={48}
                        height={48}
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3E?%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <span className="font-medium">{item.shop.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(item.time).toLocaleString('th-TH')}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-24 h-32 bg-gray-100 flex items-center justify-center">
                    <Image 
                      src={item.product.image}
                      alt={item.product.name}
                      width={80}
                      height={100}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='100' viewBox='0 0 80 100'%3E%3Crect width='80' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3E?%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-gray-600">{item.product.description}</p>
                    <p className="text-sm text-gray-600">จำนวน: {item.product.amount}</p>
                    <p className="font-medium">ราคารวม: ฿{item.totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between"
                  onClick={() => toggleExpand(item.id)}
                >
                  <span>รายละเอียดการชำระเงิน</span>
                  {isExpanded[item.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>

                {isExpanded[item.id] && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-center">
                      <Image
                        src="/qr-placeholder.png"
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
                      <p className="font-medium">บัญชีธนาคาร</p>
                      <p>ชื่อบัญชี</p>
                      <p className="font-medium">฿{item.totalPrice.toLocaleString()}</p>
                    </div>
                    <Link href={`/Payment/${item.id}`} className="block">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        สั่งซื้อ
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}