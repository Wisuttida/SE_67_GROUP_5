"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideBarFarm from "@/components/SideBarFarm";
import axios from 'axios';

interface Order {
  shop_name: string;
  order_id: string;
  name: string;
  total_price: number;
  quantity: number;
  unit: string;
  status: "รอจัดส่ง" | "กำลังจัดส่ง" | "จัดส่งแล้ว";
}

const TABS = ["รอจัดส่ง", "กำลังจัดส่ง", "จัดส่งแล้ว"];

const OrderCard = ({ order, updateOrderStatus }: { order: Order; updateOrderStatus: (order_id: string) => void }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{order.shop_name}</h2>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200">{order.status}</span>
      </div>
      <p className="text-gray-600 text-sm">รหัสคำสั่งซื้อ: {order.order_id}</p>
      <div className="mt-2 border-t pt-2">
        <p className="text-gray-800 font-medium">{order.name}</p>
        <p className="text-gray-600 text-sm">จำนวน: {order.quantity} {order.unit}</p>
        <p className="text-black font-bold">฿{order.total_price}</p>
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const statusMap = {
          "รอจัดส่ง": "confirmed",
          "กำลังจัดส่ง": "shipped",
          "จัดส่งแล้ว": "delivered",
        };
    
        const token = localStorage.getItem('token');  // หรือดึงจากคุกกี้หรือการเก็บข้อมูลอื่น ๆ
        
        const response = await axios.get(`http://localhost:8000/api/ingredient-orders/farms?status=${statusMap[selectedTab]}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // ส่ง Token ในหัวข้อ Authorization
          }
        });
    
        const transformedOrders = response.data.orders.map((order: any) => {
          const buyOffer = order.buy_offer;
          const salesOffer = order.sales_offer;

          // ดึงข้อมูลชื่อสินค้าจาก ingredients.name ของ buy_offer หรือ sales_offer
          let name = "ไม่ทราบชื่อสินค้า";
          let quantity = 0;
          let unit = "Kg"; // กำหนดเป็นค่าเริ่มต้น หากไม่มีข้อมูลจาก API

          // ตรวจสอบ buy_offer ก่อน
          if (buyOffer) {
            name = buyOffer?.buy_post?.ingredients?.name || "ไม่ทราบชื่อสินค้า";  // ใช้ buy_post.ingredients.name
            quantity = parseFloat(buyOffer?.quantity || "0");
            unit = buyOffer?.buy_post?.unit || "Kg";
          } else if (salesOffer) {  // ถ้าไม่มี buy_offer ให้ตรวจสอบ sales_offer
            name = salesOffer?.sale_post?.ingredients?.name || "ไม่ทราบชื่อสินค้า";
            quantity = parseFloat(salesOffer?.quantity || "0");
            unit = salesOffer?.sale_post?.unit || "Kg";
          }

          return {
            order_id: order.ingredient_orders_id.toString(),
            shop_name: `Shop ${order.shops_shop_id}`,  // หรือดึงข้อมูลชื่อร้านจาก API อื่นๆ
            name: name,
            total_price: parseFloat(order.total),
            quantity: quantity,
            unit: unit,
            status: order.status === 'delivered' ? 'จัดส่งแล้ว' : order.status === 'shipped' ? 'กำลังจัดส่ง' : 'รอจัดส่ง',
          };
        });

        setOrders(transformedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedTab]);

  const updateOrderStatus = async (order_id: string) => {
    try {
      // 1. เรียก CSRF cookie ก่อนที่จะส่งคำขอ PUT
      await axios.get("http://localhost:8000/csrf-token", {
        withCredentials: true, // แน่ใจว่าใช้คุกกี้
      });
  
      const token = localStorage.getItem("token"); // Token จาก localStorage หรือที่อื่นๆ
  
      // 2. ส่งคำขอ PUT ไปยัง API เพื่ออัปเดตสถานะ
      const response = await axios.put(
        `http://localhost:8000/api/ingredient-orders/${order_id}/update-to-shipped`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`, // ส่ง Token ในหัวข้อ Authorization
            //'X-CSRF-TOKEN': csrfToken, // CSRF token ต้องส่งไปใน header
            'Content-Type': 'application/json', // ตั้งค่า Content-Type เป็น JSON
          },
          withCredentials: true, // ให้แน่ใจว่า CSRF cookie ถูกส่ง
        }
      );
      // 3. อัปเดตสถานะใน local state เมื่อได้รับการตอบกลับจาก API
      if (response.data.message === 'อัปเดตสถานะคำสั่งซื้อเป็น "shipped" สำเร็จ') {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === order_id
              ? { ...order, status: "กำลังจัดส่ง" }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <div>
          <SideBarFarm />
        </div>
        <div className="flex-1 p-6 bg-gray-100">
          <div className="bg-gradient-to-br from-gray-100 to-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">การจัดส่งวัตถุดิบ</h1>
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

            {loading ? (
              <div className="text-center">กำลังโหลดข้อมูล...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.length > 0 ? (
                  orders.map((order, index) => <OrderCard key={index} order={order} updateOrderStatus={updateOrderStatus} />)
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
