"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SideBarFarm from "@/components/SideBarFarm";


interface Order {
  order_id: string;
  shop_name: string;
  shop_image? : string;
  name: string;
  total_price: number;
  quantity: number;
  unit: string;
  status: string;
  street_name: string;
  building: string;
  house_number: string;
  province: string;
  amphoe: string;
  tambon: string;
  zipcode: string; 
  description?: string;            
  payment_proof_url?: string;
}


const TABS = ["รอรับซื้อ", "รับซื้อแล้ว", "ร้านปฎิเสธ"];

const OrderCard = ({
  order,
}: {
  order: Order;  // ระบุประเภทของ order เป็น Order ที่สร้างไว้
  confirmOrder: (order_id: string) => void;
  cancelOrder: (order_id: string) => void;
  customConfirmOrder: (order_id: string, total_amount: number) => void;
  customCancelOrder: (order_id: string) => void;
}) => {

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        {order.shop_image && (
          <img
            src={order.shop_image}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <h2 className="text-lg font-semibold">คุณ {order.shop_name}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "ร้านปฎิเสธ" ? "bg-red-300" : "bg-gray-200"}`}>
          {order.status}
        </span>
      </div>

      {/* ข้อมูลสินค้า */}
      <div className="mt-4 text-left">
        {order.status === "รอรับซื้อ" ? (
          <>
            <p className="font-semibold text-gray-700">ชื่อวัตถุดิบ: {order.name}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">จำนวน: {order.quantity} {order.unit}</p>
            <p className="text-gray-600">ราคา: {order.total_price} บาท</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.house_number} {order.street_name} {order.building} {order.amphoe} {order.tambon}{order.province} {order.zipcode}</p>
          </>
        ) : order.status === "รับซื้อแล้ว" ? (
          <>
            <p className="font-semibold text-gray-700">ชื่อวัตถุดิบ: {order.name}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">จำนวน: {order.quantity} {order.unit}</p>
            <p className="text-gray-600">ราคา: {order.total_price} บาท</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.house_number} {order.street_name} {order.building} {order.amphoe} {order.tambon}{order.province} {order.zipcode}</p>
            {order.payment_proof_url && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.payment_proof_url} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        ) : (
          <>
            <p className="font-semibold text-gray-700">ชื่อวัตถุดิบ: {order.name}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">จำนวน: {order.quantity} {order.unit}</p>
            <p className="text-gray-600">ราคา: {order.total_price} บาท</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.house_number} {order.street_name} {order.building} {order.amphoe} {order.tambon}{order.province} {order.zipcode}</p>
          </>
        )}
      </div>
    </div>
  );
};

const OrderConfirmation = () => {
  const [selectedTab, setSelectedTab] = useState("รอรับซื้อ");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders([
      {
        order_id: "order-1",
        shop_name: "whoami",
        name: "น้ำลูกเหม็น",
        total_price: 500,
        quantity: 1,
        unit: "kg",
        status: "รอรับซื้อ",
        street_name: "ถนน",
        building: "อาคาร",
        house_number: "บ้านเลขที่",
        province: "จังหวัด",
        amphoe: "อำเภอ",
        tambon: "ตำบล",
        zipcode: "ไปรสนี",
        description: "เหม็นใช้ได้",        
        payment_proof_url: "image",
        shop_image : "image",
      },
      {
        order_id: "order-2",
        shop_name: "My name is Name",
        name: "น้ำหอม...ไหม",
        total_price: 500,
        quantity: 1,
        unit: "kg",
        status: "รับซื้อแล้ว",
        street_name: "ถนน",
        building: "อาคาร",
        house_number: "บ้านเลขที่",
        province: "จังหวัด",
        amphoe: "อำเภอ",
        tambon: "ตำบล",
        zipcode: "ไปรสนี", 
        description: "อาจจะหอม",       
        payment_proof_url: "image",
        shop_image : "image",
      },
      {
        order_id: "order-3",
        shop_name: "John doe",
        name: "ไม่หอม",
        total_price: 500,
        quantity: 1,
        unit: "kg",
        status: "ร้านปฎิเสธ",
        street_name: "ถนน",
        building: "อาคาร",
        house_number: "บ้านเลขที่",
        province: "จังหวัด",
        amphoe: "อำเภอ",
        tambon: "ตำบล",
        zipcode: "ไปรสนี", 
        description: "เหม็น",         
        payment_proof_url: "image",
        shop_image : "image",
      },
    ]);
  }, []);

  const confirmOrder = (order_id : string) => {
    alert("ยืนยันคำสั่งซื้อ: " + order_id);
    console.log("ยืนยันคำสั่งซื้อ", order_id);
    // คุณสามารถทำการอัพเดตสถานะหรือส่งคำขอไปที่ server ที่นี่
  };
  
  const cancelOrder = (order_id : string) => {
    alert("ยกเลิกคำสั่งซื้อ: " + order_id);
    console.log("ยกเลิกคำสั่งซื้อ", order_id);
    // อัพเดตสถานะคำสั่งซื้อเป็นยกเลิกหรือส่งคำขอไปที่ server ที่นี่
  };
  
  const customConfirmOrder = (order_id : string, total_amount : number) => {
    alert("ยืนยันคำสั่งซื้อ Custom: " + order_id + " ราคา: " + total_amount);
    console.log("ยืนยันคำสั่งซื้อ Custom", order_id, total_amount);
    // อัพเดตสถานะคำสั่งซื้อเป็นรับซื้อแล้วและกำหนดราคา
  };
  
  const customCancelOrder = (order_id : string) => {
    alert("ยกเลิกคำสั่งซื้อ Custom: " + order_id);
    console.log("ยกเลิกคำสั่งซื้อ Custom", order_id);
    // อัพเดตสถานะคำสั่งซื้อเป็นร้านปฎิเสธ
  };
  

  const filteredOrders = orders.filter((order) => order.status === selectedTab);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex">
        <div>
        <SideBarFarm />
        </div>
        <div className="flex-1">
          <div className="max-w-screen-xl mx-auto px-4 py-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <h1 className="text-2xl font-bold mb-4">คำสั่งซื้อ</h1>
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
