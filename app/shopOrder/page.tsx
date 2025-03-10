"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideBarShop from "@/components/SideBarShop";
interface Order {
  orderId: string;
  shopName: string;
  productName: string;
  price: number;
  quantity: number;
  status: string;
  address: string;
  fragrances?: string[];  // ถ้ามีค่ากลิ่น
  description?: string;   // ถ้ามีคำอธิบาย
  intensity?: number;     // ถ้ามีระดับความเข้มข้น
  volume?: number;        // ถ้ามีปริมาณ
  tester?: boolean;       // ถ้ามี Tester
}


const TABS = ["Custom", "รอยืนยัน", "ยืนยันแล้ว", "ยกเลิกแล้ว"];

const OrderCard = ({
  order,
  confirmOrder,
  cancelOrder,
  customConfirmOrder,
  customCancelOrder,
}: {
  order: Order;  // ระบุประเภทของ order เป็น Order ที่สร้างไว้
  confirmOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  customConfirmOrder: (orderId: string, price: number) => void;
  customCancelOrder: (orderId: string) => void;
}) => {
  const [price, setPrice] = useState(order.price || 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{order.shopName}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "ยกเลิกแล้ว" ? "bg-red-300" : "bg-gray-200"}`}>
          {order.status}
        </span>
      </div>

      {/* ข้อมูลสินค้า */}
      <div className="mt-4 text-left">
        <p className="font-semibold text-gray-700">สินค้า: {order.productName}</p>

        {/* แสดงข้อมูล Custom */}
        {order.status === "Custom" ? (
          <>
            <p className="text-gray-600">
              กลิ่น: {order.fragrances ? order.fragrances.join(", ") : "ไม่มีข้อมูล"}
            </p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ระดับความเข้มข้น: {order.intensity} %</p>
            <p className="text-gray-600">ปริมาณ: {order.volume} ml</p>
            <p className="text-gray-600">Tester: {order.tester ? "Yes" : "No"}</p>
            <div className="mt-4">
              <label className="block font-semibold text-gray-700">กำหนดราคา (บาท)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="mt-2 p-2 border rounded-lg w-full"
                placeholder="ระบุราคา"
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600">จำนวน: {order.quantity} ชิ้น</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.address}</p>
            <p className="text-gray-600">ราคา: {order.price} บาท</p>
          </>
        )}
      </div>

      {/* ปุ่มสำหรับ Custom */}
      {order.status === "Custom" && (
        <div className="mt-4 flex space-x-2">
          <Button className="w-1/2 bg-red-500 text-white hover:bg-red-600" onClick={() => customCancelOrder(order.orderId)}>
            ยกเลิกคำสั่งซื้อ
          </Button>

          <Button
            className="w-1/2 bg-green-600 text-white hover:bg-green-700"
            onClick={() => customConfirmOrder(order.orderId, price)}
          >
            ยืนยันคำสั่งซื้อ
          </Button>
        </div>
      )}

      {/* ปุ่มสำหรับ รอยืนยัน */}
      {order.status === "รอยืนยัน" && (
        <div className="mt-4 flex space-x-2">
          <Button className="w-1/2 bg-red-500 text-white hover:bg-red-600" onClick={() => cancelOrder(order.orderId)}>
            ยกเลิก
          </Button>
          <Button className="w-1/2 bg-green-600 text-white hover:bg-green-700" onClick={() => confirmOrder(order.orderId)}>
            ยืนยัน
          </Button>
        </div>
      )}
    </div>
  );
};

const OrderConfirmation = () => {
  const [selectedTab, setSelectedTab] = useState("รอยืนยัน");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders([
      { shopName: "User 1", orderId: "order-1", productName: "น้ำหอม A", price: 1000, quantity: 2, status: "รอยืนยัน", address: "ที่อยู่ 1" },
      { shopName: "User 2", orderId: "order-2", productName: "น้ำหอม B", price: 1200, quantity: 1, status: "ยืนยันแล้ว", address: "ที่อยู่ 2" },
      { shopName: "User 3", orderId: "order-3", productName: "น้ำหอม C", price: 800, quantity: 3, status: "ยกเลิกแล้ว", address: "ที่อยู่ 3" },
      { 
        shopName: "User 4",
        orderId: "order-4",
        productName: "น้ำหอม Custom",
        price: 0,
        quantity: 1,
        status: "Custom",
        address: "ที่อยู่ 4",
        fragrances: ["วานิลลา", "ลาเวนเดอร์", "มะลิ"], 
        description: "น้ำหอมสูตรพิเศษ ผสมกลิ่นหอมหวานและสดชื่น",
        intensity: 50,
        volume: 75,
        tester: true
      },
    ]);
  }, []);

  const confirmOrder = (orderId : string) => {
    alert("ยืนยันคำสั่งซื้อ: " + orderId);
    console.log("ยืนยันคำสั่งซื้อ", orderId);
    // คุณสามารถทำการอัพเดตสถานะหรือส่งคำขอไปที่ server ที่นี่
  };
  
  const cancelOrder = (orderId : string) => {
    alert("ยกเลิกคำสั่งซื้อ: " + orderId);
    console.log("ยกเลิกคำสั่งซื้อ", orderId);
    // อัพเดตสถานะคำสั่งซื้อเป็นยกเลิกหรือส่งคำขอไปที่ server ที่นี่
  };
  
  const customConfirmOrder = (orderId : string, price : number) => {
    alert("ยืนยันคำสั่งซื้อ Custom: " + orderId + " ราคา: " + price);
    console.log("ยืนยันคำสั่งซื้อ Custom", orderId, price);
    // อัพเดตสถานะคำสั่งซื้อเป็นยืนยันแล้วและกำหนดราคา
  };
  
  const customCancelOrder = (orderId : string) => {
    alert("ยกเลิกคำสั่งซื้อ Custom: " + orderId);
    console.log("ยกเลิกคำสั่งซื้อ Custom", orderId);
    // อัพเดตสถานะคำสั่งซื้อเป็นยกเลิกแล้ว
  };
  

  const filteredOrders = orders.filter((order) => order.status === selectedTab);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex">
        <SideBarShop />

        <div className="flex-1">
          <div className="max-w-screen-xl mx-auto px-4 py-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <h1 className="text-2xl font-bold mb-4">การยืนยันคำสั่งซื้อ</h1>
              <div className="flex justify-center space-x-4 border-b pb-2 mb-4">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 font-semibold ${selectedTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600 hover:text-blue-500"}`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <OrderCard
                      key={index}
                      order={order}
                      confirmOrder={confirmOrder}
                      cancelOrder={cancelOrder}
                      customConfirmOrder={customConfirmOrder}
                      customCancelOrder={customCancelOrder}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">ไม่มีคำสั่งซื้อในหมวดนี้</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default OrderConfirmation;
