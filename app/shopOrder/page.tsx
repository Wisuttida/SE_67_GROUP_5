"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SideBarShop from "@/components/SideBarShop";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Order {
  order_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  addresses_address_id: number;
  shops_shop_id: number;
  users_user_id: number;
  order_items: [
    {
      order_item_id: number;
      quantity: number;
      price: number;
      created_at: string;
      updated_at: string;
      products_product_id: number;
      orders_order_id: number;
      product: {
        product_id: number;
        name: string;
        description: string;
        price: number;
        volume: number;
        stock_quantity: number;
        image_url: string;
        gender_target: string;
        fragrance_strength: string;
        status: string;
        created_at: string;
        updated_at: string;
        shops_shop_id: number;
      }
    }
  ],
  user: {
    username: string;
    profile_image: string;
  },
  addresses: {
    street_name: string;
    building: string;
    house_number: string;
    province: string;
    district: string;
    subDistrict: string;
    zipcode: number;
  },
  // payments: {
  //   payment_proof_url: string;
  // }
}

const TABS = [
  {Value: "custom", Label: "Custom"},
  {Value: "custompending", Label: "รอยืนยัน Custom"},
  {Value: "cutomconfirmed", Label: "Custom ยืนยันแล้ว"},
  {Value: "customcanceled", Label: "ยกเลิก Custom"},
  { Value: "pending", Label: "รอยืนยัน" },
  { Value: "confirmed", Label: "ยืนยันแล้ว" },
  { Value: "canceled", Label: "ยกเลิกแล้ว" },

];

// คอมโพเนนต์ OrderCard
const OrderCard = ({
  order,
  onAction,
}: {
  order: Order;
  onAction: (action: string, order: Order) => void;
}) => {
  const [total_amount, setTotal_amount] = useState(order.total_amount || 0);
  const paymentProofUrl = 'https://via.placeholder.com/200';
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        {order.user.profile_image && (
          <img
            src={order.user.profile_image}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <h2 className="text-lg font-semibold">คุณ {order.user.username}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "ยกเลิกแล้ว" ? "bg-red-300" : "bg-gray-200"
            }`}
        >
          {order.status}
        </span>
      </div>

      {/* ข้อมูลสินค้า */}
      <div className="mt-4 text-left">
        <p className="font-semibold text-gray-700">ชื่อน้ำหอม: {order.order_items[0].product.name}</p>
        <p className="text-gray-600">รายละเอียด: {order.order_items[0].product.description}</p>
        <p className="text-gray-600">ปริมาณ: {order.order_items[0].product.volume} ml</p>
        <p className="text-gray-600">จำนวน: {order.order_items[0].quantity} ชิ้น</p>
        <p className="text-gray-600">ราคา: {order.order_items[0].price} บาท</p>
        <p className="text-gray-600">
          ที่อยู่จัดส่ง: {order.addresses.house_number} {order.addresses.street_name}{" "}
          {order.addresses.building} {order.addresses.district} {order.addresses.subDistrict}
          {order.addresses.province} {order.addresses.zipcode}
        </p>
        <div
          style={{
            width: 200,
            height: 200,
            border: '2px dashed #ccc',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9f9f9',
            overflow: 'hidden', // ถ้ารูปใหญ่เกินกรอบ
          }}
        >
        {paymentProofUrl ? (
          <img
            src={paymentProofUrl}
            alt="หลักฐานการโอน"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        ) : (
          <span style={{ color: '#aaa', fontSize: 14 }}>ยังไม่มีรูป</span>
        )}
      </div>
      {/* ปุ่มสำหรับการจัดการคำสั่งซื้อ */}
      <div className="mt-4 flex space-x-2">
        {order.status === "custom" && (
          <>
            <Button
              className="w-1/2 bg-red-500 text-white hover:bg-red-600"
              onClick={() => onAction("cancelCustom", order)}
            >
              ยกเลิกคำสั่งซื้อ
            </Button>
            <Button
              className="w-1/2 bg-green-600 text-white hover:bg-green-700"
              onClick={() =>
                onAction("confirmCustom", { ...order, total_amount })
              }
            >
              ยืนยันราคา
            </Button>
          </>
        )}
        {(order.status === "pending" ||
          order.status === "custompending") && (
            <>
              <Button
                className="w-1/2 bg-red-500 text-white hover:bg-red-600"
                onClick={() => onAction("cancel", order)}
              >
                ยกเลิก
              </Button>
              <Button
                className="w-1/2 bg-green-600 text-white hover:bg-green-700"
                onClick={() => onAction("confirm", order)}
              >
                ยืนยัน
              </Button>
            </>
          )}
      </div>
    </div>

      
    </div>
  );
};

// คอมโพเนนต์หลัก OrderConfirmation
const OrderConfirmation = () => {
  const csrf = localStorage.getItem('csrfToken');
  const token = localStorage.getItem('token');

  const [selectedTab, setSelectedTab] = useState("รอยืนยัน");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/seller`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrf,
          },
        })
        .then(response => {
          console.log("Data", response.data);

          if (Array.isArray(response.data)) {
            setOrders(response.data);
          } else {
            console.error("ข้อมูลที่ได้รับไม่ใช่ Array:", response.data);
          }

          setSelectedTab("pending");

        })
        .catch(error => {
          console.error("Error fetching products:", error);
        });
    } catch (error) {
      console.log(error);
    }

    // กรองคำสั่งซื้อที่ซ้ำกัน
    // const uniqueOrders = fetchedOrders.filter(
    //   (order, index, self) =>
    //     index === self.findIndex((o) => o.order_id === order.order_id)
    // );

    // setOrders(uniqueOrders);
  }, []);

  const handleAction = (action: string, order: Order) => {
    switch (action) {
      case "confirm":
        alert(`ยืนยันคำสั่งซื้อ: ${order.order_id}`);
        break;
      case "cancel":
        alert(`ยกเลิกคำสั่งซื้อ: ${order.order_id}`);
        break;
      case "confirmCustom":
        alert(
          `ยืนยันคำสั่งซื้อ Custom: ${order.order_id} ราคา: ${order.total_amount}`
        );
        break;
      case "cancelCustom":
        alert(`ยกเลิกคำสั่งซื้อ Custom: ${order.order_id}`);
        break;
      default:
        break;
    }
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
                    key={tab.Value}
                    className={`px-4 py-2 font-semibold ${selectedTab === tab.Value
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-600 hover:text-blue-500"
                      }`}
                    onClick={() => setSelectedTab(tab.Value)}
                  >
                    {tab.Label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard
                      key={order.order_id}
                      order={order}
                      onAction={handleAction}
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
