"use client";
import { useState } from 'react';
import { Search, ShoppingCart, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SideBarUser from "@/components/SideBarUser"; // เพิ่ม Sidebar ที่นี่

interface Product {
  id: string;
  name: string;
  description: string;
  amount: number;
  totalPrice: number;
  estimatedDate: string;
  image: string;
  isReceived: boolean;
  shop: {
    name: string;
    avatar: string;
  };
}

export default function UserToReceive() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample product data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Product Name',
      description: 'Description',
      amount: 1,
      totalPrice: 499,
      estimatedDate: '2025-03-15',
      image: '/images/product.png',
      isReceived: false,
      shop: {
        name: 'Shop1',
        avatar: '/profile-placeholder.png'
      }
    },
    // Add more sample products as needed
  ]);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle marking product as received
  const handleMarkAsReceived = async (productId: string) => {
    setIsLoading(true);
    try {
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, isReceived: true }
          : product
      ));
      
      toast("ยืนยันการรับสินค้าเรียบร้อยแล้ว");
    } catch (error) {
      toast("เกิดข้อผิดพลาดในการยืนยันการรับสินค้า");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar /> {/* เอา Navbar ออกมาที่ด้านบนสุด */}
      
      <div className="flex">
        <div className="w-64">
          <SideBarUser /> {/* เพิ่ม Sidebar */}
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
            <div className="flex space-x-6 ml-4">
              <Button variant="ghost" size="sm" className="p-1">
                <ShoppingCart className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <Bell className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-center mb-6">รายการที่ต้องได้รับ</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  {searchQuery ? "ไม่พบรายการที่ค้นหา" : "ไม่มีรายการที่ต้องได้รับ"}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                            <Image 
                              src={product.shop.avatar}
                              alt={product.shop.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium">{product.shop.name}</span>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            product.isReceived 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.isReceived ? 'ได้รับแล้ว' : 'รอรับสินค้า'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="w-1/3 flex justify-center items-center">
                          <div className="w-24 h-32 bg-gray-100 flex items-center justify-center">
                            <Image 
                              src={product.image}
                              alt={product.name}
                              width={60}
                              height={100}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        
                        <div className="w-2/3 pl-4">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                          <p className="text-sm text-gray-600">จำนวน: {product.amount} ชิ้น</p>
                          <p className="text-sm text-gray-600">ราคารวม: ฿{product.totalPrice.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mb-4">
                            วันที่คาดว่าจะได้รับ: {new Date(product.estimatedDate).toLocaleDateString('th-TH')}
                          </p>
                          
                          {!product.isReceived && (
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleMarkAsReceived(product.id)}
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
