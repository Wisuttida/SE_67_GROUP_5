"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const TABS = ["รอยืนยัน", "ยืนยันแล้ว", "ยกเลิกแล้ว"]; // เพิ่ม "ยกเลิกแล้ว" ใน TABS

const OrderCard = ({ order, confirmOrder, cancelOrder }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{order.shopName}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "ยกเลิกแล้ว" ? "bg-red-300" : "bg-gray-200"}`}>
          {order.status}
        </span>
      </div>
      <p className="text-gray-600 text-sm">รหัสคำสั่งซื้อ: {order.orderId}</p>
      <div className="mt-2 border-t pt-2 text-center">
        <img src={order.productImage} alt="รูปสินค้า" className="mt-2 rounded-lg shadow-md w-full" key={order.productImage} />
        <p className="text-gray-800 font-medium mt-2">{order.productName}</p>
        <p className="text-gray-600 text-sm">จำนวน: {order.quantity} ชิ้น</p>
        <p className="text-black font-bold">฿{order.price}</p>
        <p className="text-gray-600 text-sm mt-2">ที่อยู่การจัดส่ง: {order.address}</p>
      </div>
      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">หลักฐานการโอนเงิน:</p>
        <img src={order.slip} alt="สลิปโอนเงิน" className="mt-2 rounded-lg shadow-md w-full" key={order.slip} />
      </div>
      
      {order.status === "รอยืนยัน" && (
        <div className="mt-4 flex space-x-2">
          {/* ปุ่มยกเลิก */}
          <Button 
            className="w-1/2 bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              if (window.confirm("คุณต้องการยกเลิกคำสั่งซือนี้ใช่หรือไม่?")) {
                cancelOrder(order.orderId);
              }
            }}
          >
            ยกเลิกคำสั่งซื้อ
          </Button>

          {/* ปุ่มยืนยัน */}
          <Button 
            className="w-1/2 bg-green-600 text-white hover:bg-green-700" 
            onClick={() => {
              if (window.confirm("ยืนยันการสั่งซื้อและตรวจสอบการโอนเงินเรียบร้อยแล้ว?")) {
                confirmOrder(order.orderId);
              }
            }}
          >
            ยืนยันคำสั่งซื้อ
          </Button>
        </div>
      )}
    </div>
  );
};


const OrderConfirmation = () => {
  const [selectedTab, setSelectedTab] = useState("รอยืนยัน");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders([
      { shopName: "User 1", orderId: "order-1", productName: "สินค้า 1", price: 500, quantity: 1, status: "รอยืนยัน", slip: "/", productImage: "/images/product1.jpg" },
      { shopName: "User 2", orderId: "order-2", productName: "สินค้า 2", price: 1200, quantity: 2, status: "รอยืนยัน", slip: "/images/slip2.jpg", productImage: "/images/product2.jpg" },
      { shopName: "User 4", orderId: "order-4", productName: "สินค้า 4", price: 1200, quantity: 2, status: "ยกเลิกแล้ว", slip: "/images/slip2.jpg", productImage: "/images/product2.jpg" },
      { shopName: "User 3", orderId: "order-3", productName: "สินค้า 3", price: 2100, quantity: 3, status: "ยืนยันแล้ว", slip: "/images/slip3.jpg", productImage: "/images/product3.jpg" }
    ]);
  }, []);
  
  const confirmOrder = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderId === orderId ? { ...order, status: "ยืนยันแล้ว" } : order
      )
    );
  };

  // ฟังก์ชันยกเลิกคำสั่งซื้อ
  const cancelOrder = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderId === orderId ? { ...order, status: "ยกเลิกแล้ว" } : order // เปลี่ยนสถานะเป็น "ยกเลิกแล้ว"
      )
    );
  };

  // กรองคำสั่งซื้อที่มีสถานะเป็น "รอยืนยัน", "ยืนยันแล้ว", หรือ "ยกเลิกแล้ว"
  const filteredOrders = orders.filter(order => order.status === selectedTab);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">การยืนยันคำสั่งซื้อ</h1>
          <div className="flex justify-center space-x-4 border-b pb-2 mb-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => <OrderCard key={index} order={order} confirmOrder={confirmOrder} cancelOrder={cancelOrder} />)
            ) : (
              <p className="text-gray-500">ไม่มีคำสั่งซื้อในหมวดนี้</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
