"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideBarShop from "@/components/SideBarShop";


interface Order {
  orderId: string;
  userName: string;
  productName: string;
  price: number;
  quantity: number;
  status: string;
  address: string;
  fragrances?: string[];  
  description?: string;   
  intensity?: number;     
  volume?: number;        
  tester?: boolean;       
  slipImage?: string;
  productImage? : string;
  profileImage? : string;
}


const TABS = ["Custom", "รอยืนยัน Custom", "Custom ยืนยันแล้ว", "ยกเลิก Custom", "รอยืนยัน", "ยืนยันแล้ว", "ยกเลิกแล้ว"];

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
        {order.profileImage && (
          <img
            src={order.profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <h2 className="text-lg font-semibold">คุณ {order.userName}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "ยกเลิกแล้ว" ? "bg-red-300" : "bg-gray-200"}`}>
          {order.status}
        </span>
      </div>

      {/* ข้อมูลสินค้า */}
      <div className="mt-4 text-left">
        {order.status === "รอยืนยัน" ? (
          <>
            {order.productImage && (
              <div className="mt-4">
                <img src={order.productImage} alt="ProductImage" className="mt-2 w-full rounded-lg" />
              </div>
            )}
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.productName}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ปริมาณ: {order.volume} ml</p>
            <p className="text-gray-600">จำนวน: {order.quantity} ชิ้น</p>
            <p className="text-gray-600">ราคา: {order.price} บาท</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.address}</p>
            {order.slipImage && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.slipImage} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        ) : order.status === "Custom" ? (
          <>
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.productName}</p>
            <p className="text-gray-600">กลิ่น: {order.fragrances ? order.fragrances.join(", ") : "ไม่มีข้อมูล"}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ระดับความเข้มข้น: {order.intensity} %</p>
            <p className="text-gray-600">ปริมาณ: {order.volume} ml</p>

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
        ) : order.status === "รอยืนยัน Custom" ? (
          <>
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.productName}</p>
            <p className="text-gray-600">กลิ่น: {order.fragrances ? order.fragrances.join(", ") : "ไม่มีข้อมูล"}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ระดับความเข้มข้น: {order.intensity} %</p>
            <p className="text-gray-600">ปริมาณ: {order.volume} ml</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.address}</p>
            {order.slipImage && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.slipImage} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        ) : order.status === "Custom ยืนยันแล้ว" ?  (
          <>
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.productName}</p>
            <p className="text-gray-600">กลิ่น: {order.fragrances ? order.fragrances.join(", ") : "ไม่มีข้อมูล"}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ระดับความเข้มข้น: {order.intensity} %</p>
            <p className="text-gray-600">ปริมาณ: {order.volume} ml</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.address}</p>
            {order.slipImage && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.slipImage} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        ) : order.status === "ยกเลิก Custom" ? (
          <>
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.productName}</p>
            <p className="text-gray-600">กลิ่น: {order.fragrances ? order.fragrances.join(", ") : "ไม่มีข้อมูล"}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ระดับความเข้มข้น: {order.intensity} %</p>
            <p className="text-gray-600">ปริมาณ: {order.volume} ml</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.address}</p>
            {order.slipImage && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.slipImage} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        ) : order.status === "ยืนยันแล้ว" ? (
          <>
            {order.productImage && (
              <div className="mt-4">
                <img src={order.productImage} alt="ProductImage" className="mt-2 w-full rounded-lg" />
              </div>
            )}
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.productName}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ปริมาณ: {order.volume} ml</p>
            <p className="text-gray-600">จำนวน: {order.quantity} ชิ้น</p>
            <p className="text-gray-600">ราคา: {order.price} บาท</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.address}</p>
            {order.slipImage && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.slipImage} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        ) : (
          <>
            {order.productImage && (
              <div className="mt-4">
                <img src={order.productImage} alt="ProductImage" className="mt-2 w-full rounded-lg" />
              </div>
            )}
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.productName}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ปริมาณ: {order.volume} ml</p>
            <p className="text-gray-600">จำนวน: {order.quantity} ชิ้น</p>
            <p className="text-gray-600">ราคา: {order.price} บาท</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.address}</p>
            {order.slipImage && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.slipImage} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
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
            ยืนยันราคา
          </Button>
        </div>
      )}

      {/* ปุ่มสำหรับ รอยืนยัน */}
      {(order.status === "รอยืนยัน" || order.status === "รอยืนยัน Custom") && (
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
      {
        orderId: "order-1",
        userName: "whoami",
        productName: "น้ำลูกเหม็น",
        price: 500,
        quantity: 1,
        status: "รอยืนยัน",
        address: "ม.เกษตร กำแพงแสน",
        fragrances: [""], 
        description: "เหม็นใช้ได้",   
        intensity: 100,     
        volume: 1000 ,       
        tester: false,       
        slipImage: "image",
        productImage : "image",
        profileImage : "image",
      },
      {
        orderId: "order-2",
        userName: "My name is Name",
        productName: "น้ำหอม...ไหม",
        price: 500,
        quantity: 1,
        status: "ยืนยันแล้ว",
        address: "ม.เกษตร กำแพงแสน",
        fragrances: [""], 
        description: "อาจจะหอม",   
        intensity: 100,     
        volume: 1000 ,       
        tester: false,       
        slipImage: "image",
        productImage : "image",
        profileImage : "image",
      },
      {
        orderId: "order-3",
        userName: "John doe",
        productName: "ไม่หอม",
        price: 500,
        quantity: 1,
        status: "ยกเลิกแล้ว",
        address: "ม.เกษตร กำแพงแสน",
        fragrances: [""], 
        description: "เหม็น",   
        intensity: 100,     
        volume: 1000 ,       
        tester: false,       
        slipImage: "image",
        productImage : "image",
        profileImage : "image",
      },
      {
        orderId: "order-4",
        userName: "John smith",
        productName: "เลือกไปก่อน เดี๋ยวหอมเอง",
        price: 500,
        quantity: 1,
        status: "Custom",
        address: "ม.เกษตร กำแพงแสน",
        fragrances: ["กระเทียม","รากผักชี","พริกไทย"], 
        description: "มั่วเอา ไม่หอมโทษร้าน",   
        intensity: 100,     
        volume: 1000 ,       
        tester: false,       
        slipImage: "image",
        productImage : "image",
        profileImage : "image",
      },
      {
        orderId: "order-4",
        userName: "John smith",
        productName: "เลือกไปก่อน เดี๋ยวหอมเอง",
        price: 500,
        quantity: 1,
        status: "รอยืนยัน Custom",
        address: "ม.เกษตร กำแพงแสน",
        fragrances: ["กระเทียม","รากผักชี","พริกไทย"], 
        description: "มั่วเอา ไม่หอมโทษร้าน",   
        intensity: 100,     
        volume: 1000 ,       
        tester: false,       
        slipImage: "image",
        productImage : "image",
        profileImage : "image",
      },
      {
        orderId: "order-4",
        userName: "John smith",
        productName: "เลือกไปก่อน เดี๋ยวหอมเอง",
        price: 500,
        quantity: 1,
        status: "ยกเลิก Custom",
        address: "ม.เกษตร กำแพงแสน",
        fragrances: ["กระเทียม","รากผักชี","พริกไทย"], 
        description: "มั่วเอา ไม่หอมโทษร้าน",   
        intensity: 100,     
        volume: 1000 ,       
        tester: false,       
        slipImage: "image",
        productImage : "image",
        profileImage : "image",
      },
      {
        orderId: "order-5",
        userName: "Lorla",
        productName: "หอมสดชื่น by Lorla",
        price: 500,
        quantity: 1,
        status: "Custom ยืนยันแล้ว",
        address: "ม.เกษตร กำแพงแสน",
        fragrances: ["มะลิ","กุหลาบ","ลาเวนเดอร์"], 
        description: "มะลิจางๆ กุหลาบอ่อนๆ เน้นความสดชื่นจากลาเวนเดอร์",   
        intensity: 100,     
        volume: 1000 ,       
        tester: false,       
        slipImage: "image",
        productImage : "image",
        profileImage : "image",
      }
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
