"use client";
import { useState, useEffect } from 'react';
import { Search, Truck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Image from "next/image";

interface ShippingOrder {
  id: string;
  shop: string;
  productName: string;
  orderDate: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  quantity: number;
  totalPrice: number;
  image?: string;
}

export default function UserPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ShippingOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Simulated API call to fetch orders
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data based on the database schema
        const mockOrders: ShippingOrder[] = [
          { id: 'order-1', shop: 'Shop1', productName: 'Product Name', orderDate: '2023-10-01', status: 'pending', quantity: 2, totalPrice: 1000, image: '/images/product.png' },
          { id: 'order-2', shop: 'Shop2', productName: 'Custom Product', orderDate: '2023-10-02', status: 'shipped', quantity: 1, totalPrice: 750, image: '/images/product.png' },
        ];

        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      } catch (error) {
        toast("ไม่สามารถดึงข้อมูลรายการสินค้าที่ต้องจัดส่งได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  useEffect(() => {
    const result = orders.filter(order => 
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shop.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Navbar />
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
        <h1 className="text-2xl font-bold text-center mb-6">รายการที่ต้องจัดส่ง</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-500">
              {searchQuery ? "ไม่พบรายการที่ค้นหา" : "ไม่มีรายการที่ต้องจัดส่ง"}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                        <Image 
                          src={order.image || '/profile-placeholder.png'}
                          alt="Shop Profile"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">{order.shop}</span>
                    </div>
                    <span className={`text-sm ${order.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="font-medium">{order.productName}</p>
                    <p className="text-gray-600">วันที่สั่งซื้อ: {new Date(order.orderDate).toLocaleDateString('th-TH')}</p>
                    <p className="text-gray-600">จำนวน: {order.quantity} ชิ้น</p>
                    <p className="text-gray-600">ราคา: ฿{order.totalPrice.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}