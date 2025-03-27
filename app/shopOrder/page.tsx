"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideBarShop from "@/components/SideBarShop";


interface Order {
  order_id: string;
  username: string;
  name: string;
  total_amount: number;
  quantity: number;
  status: string;
  street_name: string;
  building: string;
  house_number: string;
  province: string;
  amphoe: string;
  tambon: string;
  zipcode: string;
  fragrance_name?: string[];  
  description?: string;   
  intensity_level?: number;     
  volume_ml?: number;        
  is_tester?: boolean;         
  payment_proof_url?: string;
  image_url? : string;
  profile_image? : string;
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
  confirmOrder: (order_id: string) => void;
  cancelOrder: (order_id: string) => void;
  customConfirmOrder: (order_id: string, total_amount: number) => void;
  customCancelOrder: (order_id: string) => void;
}) => {
  const [total_amount, setTotal_amount] = useState(order.total_amount || 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        {order.profile_image && (
          <img
            src={order.profile_image}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <h2 className="text-lg font-semibold">คุณ {order.username}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "ยกเลิกแล้ว" ? "bg-red-300" : "bg-gray-200"}`}>
          {order.status}
        </span>
      </div>

      {/* ข้อมูลสินค้า */}
      <div className="mt-4 text-left">
        {order.status === "รอยืนยัน" ? (
          <>
            {order.image_url && (
              <div className="mt-4">
                <img src={order.image_url} alt="image_url" className="mt-2 w-full rounded-lg" />
              </div>
            )}
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.name}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ปริมาณ: {order.volume_ml} ml</p>
            <p className="text-gray-600">จำนวน: {order.quantity} ชิ้น</p>
            <p className="text-gray-600">ราคา: {order.total_amount} บาท</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.house_number} {order.street_name} {order.building} {order.amphoe} {order.tambon}{order.province} {order.zipcode}</p>
            {order.payment_proof_url && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.payment_proof_url} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        ) : order.status === "Custom" ? (
          <>
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.name}</p>
            <p className="text-gray-600">กลิ่น: {order.fragrance_name ? order.fragrance_name.join(", ") : "ไม่มีข้อมูล"}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ระดับความเข้มข้น: {order.intensity_level} %</p>
            <p className="text-gray-600">ปริมาณ: {order.volume_ml} ml</p>
            <p className="text-gray-600">is_tester: {order.is_tester ? "ตัวเทส" : "ตัวจริง"}</p>
            <div className="mt-4">
              <label className="block font-semibold text-gray-700">กำหนดราคา (บาท)</label>
              <input
                type="number"
                value={total_amount}
                onChange={(e) => setTotal_amount(parseFloat(e.target.value))}
                className="mt-2 p-2 border rounded-lg w-full"
                placeholder="ระบุราคา"
              />
            </div>
          </>
        ) : order.status === "รอยืนยัน Custom" ? (
          <>
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.name}</p>
            <p className="text-gray-600">กลิ่น: {order.fragrance_name ? order.fragrance_name.join(", ") : "ไม่มีข้อมูล"}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ระดับความเข้มข้น: {order.intensity_level} %</p>
            <p className="text-gray-600">ปริมาณ: {order.volume_ml} ml</p>
            <p className="text-gray-600">is_tester: {order.is_tester ? "ตัวเทส" : "ตัวจริง"}</p>
            <p className="text-gray-600">ราคา: {order.total_amount} ml</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.house_number} {order.street_name} {order.building} {order.amphoe} {order.tambon}{order.province} {order.zipcode}</p>
            {order.payment_proof_url && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.payment_proof_url} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        ) : order.status === "Custom ยืนยันแล้ว" ?  (
          <>
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.name}</p>
            <p className="text-gray-600">กลิ่น: {order.fragrance_name ? order.fragrance_name.join(", ") : "ไม่มีข้อมูล"}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ระดับความเข้มข้น: {order.intensity_level} %</p>
            <p className="text-gray-600">ปริมาณ: {order.volume_ml} ml</p>
            <p className="text-gray-600">is_tester: {order.is_tester ? "ตัวเทส" : "ตัวจริง"}</p>
            <p className="text-gray-600">ราคา: {order.total_amount} ml</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.house_number} {order.street_name} {order.building} {order.amphoe} {order.tambon}{order.province} {order.zipcode}</p>
            {order.payment_proof_url && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.payment_proof_url} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        ) : order.status === "ยกเลิก Custom" ? (
          <>
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.name}</p>
            <p className="text-gray-600">กลิ่น: {order.fragrance_name ? order.fragrance_name.join(", ") : "ไม่มีข้อมูล"}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ระดับความเข้มข้น: {order.intensity_level} %</p>
            <p className="text-gray-600">ปริมาณ: {order.volume_ml} ml</p>
            <p className="text-gray-600">is_tester: {order.is_tester ? "ตัวเทส" : "ตัวจริง"}</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.house_number} {order.street_name} {order.building} {order.amphoe} {order.tambon}{order.province} {order.zipcode}</p>
            {order.payment_proof_url && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.payment_proof_url} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        ) : order.status === "ยืนยันแล้ว" ? (
          <>
            {order.image_url && (
              <div className="mt-4">
                <img src={order.image_url} alt="image_url" className="mt-2 w-full rounded-lg" />
              </div>
            )}
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.name}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ปริมาณ: {order.volume_ml} ml</p>
            <p className="text-gray-600">จำนวน: {order.quantity} ชิ้น</p>
            <p className="text-gray-600">ราคา: {order.total_amount} บาท</p>
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
            {order.image_url && (
              <div className="mt-4">
                <img src={order.image_url} alt="image_url" className="mt-2 w-full rounded-lg" />
              </div>
            )}
            <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.name}</p>
            <p className="text-gray-600">รายละเอียด: {order.description}</p>
            <p className="text-gray-600">ปริมาณ: {order.volume_ml} ml</p>
            <p className="text-gray-600">จำนวน: {order.quantity} ชิ้น</p>
            <p className="text-gray-600">ราคา: {order.total_amount} บาท</p>
            <p className="text-gray-600">ที่อยู่จัดส่ง: {order.house_number} {order.street_name} {order.building} {order.amphoe} {order.tambon}{order.province} {order.zipcode}</p>
            {order.payment_proof_url && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">หลักฐานการโอน:</p>
                <img src={order.payment_proof_url} alt="Slip" className="mt-2 w-full rounded-lg" />
              </div>
            )}
          </>
        )}
      </div>

      {/* ปุ่มสำหรับ Custom */}
      {order.status === "Custom" && (
        <div className="mt-4 flex space-x-2">
          <Button className="w-1/2 bg-red-500 text-white hover:bg-red-600" onClick={() => customCancelOrder(order.order_id)}>
            ยกเลิกคำสั่งซื้อ
          </Button>

          <Button
            className="w-1/2 bg-green-600 text-white hover:bg-green-700"
            onClick={() => customConfirmOrder(order.order_id, total_amount)}
          >
            ยืนยันราคา
          </Button>
        </div>
      )}

      {/* ปุ่มสำหรับ รอยืนยัน */}
      {(order.status === "รอยืนยัน" || order.status === "รอยืนยัน Custom") && (
        <div className="mt-4 flex space-x-2">
          <Button className="w-1/2 bg-red-500 text-white hover:bg-red-600" onClick={() => cancelOrder(order.order_id)}>
            ยกเลิก
          </Button>
          <Button className="w-1/2 bg-green-600 text-white hover:bg-green-700" onClick={() => confirmOrder(order.order_id)}>
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
        order_id: "order-1",
        username: "whoami",
        name: "น้ำลูกเหม็น",
        total_amount: 500,
        quantity: 1,
        status: "รอยืนยัน",
        street_name: "ถนน",
        building: "อาคาร",
        house_number: "บ้านเลขที่",
        province: "จังหวัด",
        amphoe: "อำเภอ",
        tambon: "ตำบล",
        zipcode: "ไปรสนี",
        fragrance_name: [""], 
        description: "เหม็นใช้ได้",   
        intensity_level: 100,     
        volume_ml: 1000 ,       
        is_tester: false,       
        payment_proof_url: "image",
        image_url : "image",
        profile_image : "image",
      },
      {
        order_id: "order-2",
        username: "My name is Name",
        name: "น้ำหอม...ไหม",
        total_amount: 500,
        quantity: 1,
        status: "ยืนยันแล้ว",
        street_name: "ถนน",
        building: "อาคาร",
        house_number: "บ้านเลขที่",
        province: "จังหวัด",
        amphoe: "อำเภอ",
        tambon: "ตำบล",
        zipcode: "ไปรสนี",
        fragrance_name: [""], 
        description: "อาจจะหอม",   
        intensity_level: 100,     
        volume_ml: 1000 ,       
        is_tester: false,       
        payment_proof_url: "image",
        image_url : "image",
        profile_image : "image",
      },
      {
        order_id: "order-3",
        username: "John doe",
        name: "ไม่หอม",
        total_amount: 500,
        quantity: 1,
        status: "ยกเลิกแล้ว",
        street_name: "ถนน",
        building: "อาคาร",
        house_number: "บ้านเลขที่",
        province: "จังหวัด",
        amphoe: "อำเภอ",
        tambon: "ตำบล",
        zipcode: "ไปรสนี",
        fragrance_name: [""], 
        description: "เหม็น",   
        intensity_level: 100,     
        volume_ml: 1000 ,       
        is_tester: false,       
        payment_proof_url: "image",
        image_url : "image",
        profile_image : "image",
      },
      {
        order_id: "order-4",
        username: "John smith",
        name: "เลือกไปก่อน เดี๋ยวหอมเอง",
        total_amount: 500,
        quantity: 1,
        status: "Custom",
        street_name: "ถนน",
        building: "อาคาร",
        house_number: "บ้านเลขที่",
        province: "จังหวัด",
        amphoe: "อำเภอ",
        tambon: "ตำบล",
        zipcode: "ไปรสนี",
        fragrance_name: ["กระเทียม","รากผักชี","พริกไทย"], 
        description: "มั่วเอา ไม่หอมโทษร้าน",   
        intensity_level: 100,     
        volume_ml: 1000 ,       
        is_tester: false,       
        payment_proof_url: "image",
        image_url : "image",
        profile_image : "image",
      },
      {
        order_id: "order-4",
        username: "John smith",
        name: "เลือกไปก่อน เดี๋ยวหอมเอง",
        total_amount: 500,
        quantity: 1,
        status: "รอยืนยัน Custom",
        street_name: "ถนน",
        building: "อาคาร",
        house_number: "บ้านเลขที่",
        province: "จังหวัด",
        amphoe: "อำเภอ",
        tambon: "ตำบล",
        zipcode: "ไปรสนี",
        fragrance_name: ["กระเทียม","รากผักชี","พริกไทย"], 
        description: "มั่วเอา ไม่หอมโทษร้าน",   
        intensity_level: 100,     
        volume_ml: 1000 ,       
        is_tester: false,       
        payment_proof_url: "image",
        image_url : "image",
        profile_image : "image",
      },
      {
        order_id: "order-4",
        username: "John smith",
        name: "เลือกไปก่อน เดี๋ยวหอมเอง",
        total_amount: 500,
        quantity: 1,
        status: "ยกเลิก Custom",
        street_name: "ถนน",
        building: "อาคาร",
        house_number: "บ้านเลขที่",
        province: "จังหวัด",
        amphoe: "อำเภอ",
        tambon: "ตำบล",
        zipcode: "ไปรสนี",
        fragrance_name: ["กระเทียม","รากผักชี","พริกไทย"], 
        description: "มั่วเอา ไม่หอมโทษร้าน",   
        intensity_level: 100,     
        volume_ml: 1000 ,       
        is_tester: false,       
        payment_proof_url: "image",
        image_url : "image",
        profile_image : "image",
      },
      {
        order_id: "order-5",
        username: "Lorla",
        name: "หอมสดชื่น by Lorla",
        total_amount: 500,
        quantity: 1,
        status: "Custom ยืนยันแล้ว",
        street_name: "ถนน",
        building: "อาคาร",
        house_number: "บ้านเลขที่",
        province: "จังหวัด",
        amphoe: "อำเภอ",
        tambon: "ตำบล",
        zipcode: "ไปรสนี",
        fragrance_name: ["มะลิ","กุหลาบ","ลาเวนเดอร์"], 
        description: "มะลิจางๆ กุหลาบอ่อนๆ เน้นความสดชื่นจากลาเวนเดอร์",   
        intensity_level: 100,     
        volume_ml: 1000 ,       
        is_tester: false,       
        payment_proof_url: "image",
        image_url : "image",
        profile_image : "image",
      }
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
    // อัพเดตสถานะคำสั่งซื้อเป็นยืนยันแล้วและกำหนดราคา
  };
  
  const customCancelOrder = (order_id : string) => {
    alert("ยกเลิกคำสั่งซื้อ Custom: " + order_id);
    console.log("ยกเลิกคำสั่งซื้อ Custom", order_id);
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
