"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import SideBarUser from '@/components/SideBarUser';

interface OrderData {
  user: string;
  productName: string;
  strength: string;
  amount: number;
  price: number;
}

const initialOrders: OrderData[] = [
  { user: "User1", productName: "น้ำหอม: กลิ่นหวาน", strength: "100%", amount: 75, price: 200 },
  { user: "User2", productName: "น้ำหอม: กลิ่นสดชื่น", strength: "100%", amount: 75, price: 250 },
  // Add more sample data as needed
];

export default function CustomizeOrder() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);

  const handleApply = (index: number) => {
    // Logic to apply the order
    toast(`Order for ${orders[index].user} applied successfully!`);
  };

  return (
    <div>
      <Navbar />
      <div className="flex p-4">
        {/* Sidebar */}
        <div className="hidden md:block w-1/4">
          <SideBarUser />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <h2 className="text-xl font-semibold mb-4">Customize Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <p className="font-medium">{order.user}</p>
                  <p>ชื่อหอม: {order.productName}</p>
                  <p>ความเข้มข้น: {order.strength}</p>
                  <p>ปริมาณ: {order.amount} ml</p>
                  <p>ราคา: {order.price} ฿</p>
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleApply(index)}
                    >
                      Apply
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-500"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
