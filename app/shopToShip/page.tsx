"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideBarShop from "@/components/SideBarShop";

const TABS = ["confirmed", "shipped", "delivered"];


interface Order {
  username: string;
  order_id: string;
  name: string;
  price: number;
  quantity: number;
  status: "confirmed" | "shipped" | "delivered";
  product_image: string;
  product_description: string;
}

const ShippingDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("confirmed");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // ฟังก์ชันดึงคำสั่งซื้อจาก API
  const fetchOrdersByStatus = async (status: string) => {
    const csrfToken = localStorage.getItem('csrfToken');
    const token = localStorage.getItem('token');
    
    setLoading(true); // เริ่มโหลด
    try {
      const response = await axios.get(`http://localhost:8000/api/orders/status/${status}`, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,  // ส่ง CSRF token
          'Authorization': `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
        },
        withCredentials: true,  // ใช้ if ต้องการส่ง cookies
      });

      // แปลงข้อมูลที่ได้รับจาก API ให้ตรงตามที่ต้องการ
      const transformedOrders = response.data.map((order: any) => ({
        username: order.user.username, // เปลี่ยนจาก user.user_id -> username
        order_id: order.order_id,
        name: order.order_items[0].product.name,
        price: parseFloat(order.total_amount), // เปลี่ยนจาก total_amount -> order.price
        quantity: order.order_items[0].quantity,
        status: order.status,
        product_image: order.order_items[0].product.image_url,
        product_description: order.order_items[0].product.description,
      }));

      setOrders(transformedOrders);  // เซ็ตข้อมูลคำสั่งซื้อที่แปลงแล้ว
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);  // ปิดการโหลด
    }
  };

  // เมื่อเลือกแท็บใหม่ให้ดึงข้อมูลคำสั่งซื้อที่กรองตามสถานะ
  useEffect(() => {
    fetchOrdersByStatus(selectedTab);
  }, [selectedTab]);

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
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-semibold ${selectedTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
                  onClick={() => setSelectedTab(tab)}  // เปลี่ยนแท็บ
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* แสดงข้อมูลเมื่อโหลดเสร็จ */}
            {loading ? (
              <div className="text-center">กำลังโหลด...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
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
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">ไม่มีคำสั่งซื้อในหมวดนี้</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDashboard;
