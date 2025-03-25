"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideBarShop from "@/components/SideBarShop";

interface Order {
  username: string;
  order_id: string;
  name: string;
  price: number;
  quantity: number;
  status: "รอจัดส่ง" | "กำลังจัดส่ง" | "จัดส่งแล้ว";
}

const initialOrders: Order[] = [
  { username: "User 1", order_id: "order-1", name: "สินค้า 1", price: 500, quantity: 1, status: "รอจัดส่ง" },
  { username: "User 2", order_id: "order-2", name: "สินค้า 2", price: 1200, quantity: 2, status: "รอจัดส่ง" },
  { username: "User 3", order_id: "order-3", name: "สินค้า 3", price: 2100, quantity: 3, status: "กำลังจัดส่ง" },
  { username: "User 4", order_id: "order-4", name: "สินค้า 4", price: 3200, quantity: 4, status: "จัดส่งแล้ว" },
  { username: "User 5", order_id: "order-5", name: "สินค้า 5", price: 4500, quantity: 5, status: "จัดส่งแล้ว" },
  { username: "User 6", order_id: "order-6", name: "สินค้า 6", price: 6000, quantity: 6, status: "รอจัดส่ง" },
];

const TABS = ["รอจัดส่ง", "กำลังจัดส่ง", "จัดส่งแล้ว"];

const OrderCard = ({ order, updateOrderStatus }: { order: Order; updateOrderStatus: (order_id: string) => void }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{order.username}</h2>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200">{order.status}</span>
      </div>
      <p className="text-gray-600 text-sm">รหัสคำสั่งซื้อ: {order.order_id}</p>
      <div className="mt-2 border-t pt-2">
        <p className="text-gray-800 font-medium">{order.name}</p>
        <p className="text-gray-600 text-sm">จำนวน: {order.quantity} ชิ้น</p>
        <p className="text-black font-bold">฿{order.price}</p>
      </div>
      <div className="mt-4 flex gap-2">
        {order.status === "รอจัดส่ง" ? (
          <Button 
            className="w-full bg-blue-600 text-white hover:bg-blue-700" 
            onClick={() => {
              if (window.confirm("จัดส่งสำเร็จใช่ไหม?")) {
                updateOrderStatus(order.order_id);
              }
            }}
          >
            ยืนยันการจัดส่ง
          </Button>
        ) : null}
      </div>
    </div>
  );
};

const ShippingDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("รอจัดส่ง");
  const [orders, setOrders] = useState(initialOrders);

  const updateOrderStatus = (order_id : string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.order_id === order_id ? { ...order, status: "กำลังจัดส่ง" } : order
      )
    );
  };

  const filteredOrders = orders.filter(order => order.status === selectedTab);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <SideBarShop />
        

        {/* Main content area */}
        <div className="flex-1 p-6 bg-gray-100">
          <div className="bg-gradient-to-br from-gray-100 to-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">การจัดส่งสินค้า</h1>
            <div className="flex space-x-4 border-b pb-2 mb-4">
              {TABS.map(tab => (
                <button 
                  key={tab}
                  className={`px-4 py-2 font-semibold ${selectedTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => <OrderCard key={index} order={order} updateOrderStatus={updateOrderStatus} />)
              ) : (
                <p className="text-gray-500">ไม่มีคำสั่งซื้อในหมวดนี้</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDashboard;
