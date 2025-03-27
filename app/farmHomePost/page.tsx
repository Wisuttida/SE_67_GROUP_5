"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SideBarFarm from "@/components/SideBarFarm";
import axios from "axios";

interface BuyPost {
  post_id: number;
  shop_id: number;
  shop_image: string | null;
  shop_name: string;
  description: string;
  price_per_unit: number;
  amount: number;
  unit: string;
  ingredient_name: string;
  status: string;
  sold_amount: number;
}

const ShopHomePost = () => {
  const [buyPosts, setBuyPosts] = useState([]);
  const [selectedBuyPost, setSelectedBuyPost] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [total_price, setTotal_price] = useState(0);
  const [csrfToken, setCsrfToken] = useState("");
  const router = useRouter();
  const authToken = localStorage.getItem('token');
  
  // ตรวจสอบว่า authToken มีค่าไหม
  if (!authToken) {
    console.error('Authorization token not found');
  }
  
  // useEffect สำหรับดึง CSRF Token
  useEffect(() => {
    if (!authToken) return;
    axios.get('http://localhost:8000/csrf-token', { withCredentials: true })
      .then(response => {
        setCsrfToken(response.data.csrf_token);
      })
      .catch(error => {
        console.error("Error fetching CSRF Token:", error);
      });
  }, [authToken]); // useEffect นี้ไม่ต้องการการเช็ค authToken
  
  useEffect(() => {
    // ดึงข้อมูลโพสต์ซื้อ
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/show-buyposts`, { 
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true // ตรวจสอบคุกกี้ CSRF
    })
    .then(response => {
      const updatedBuyPosts = response.data.buy_posts.map((post: any) => ({
        ...post,
        price_per_unit: Number(post.price_per_unit), // แปลงเป็น number
        amount: Number(post.amount), // แปลงเป็น number
        sold_amount: Number(post.sold_amount), // แปลงเป็น number
      }));
      setBuyPosts(updatedBuyPosts);
      console.log(updatedBuyPosts);
    })
    .catch(error => {
      console.error("Error fetching buy posts:", error);
    });
  }, []);
  

  const handleOrderCustomize = (post: any) => {
    setSelectedBuyPost(post);
    setQuantity(1);
    setTotal_price(post.price_per_unit); // ตั้งค่าเริ่มต้น
  };

  const closeModal = () => {
    setSelectedBuyPost(null);
  };

  const handleConfirm = () => {
    const userResponse = confirm("ต้องการดำเนินการต่อหรือไม่?");
    if (userResponse) {
      const orderData = {
        shop_id: selectedBuyPost?.shop_id,
        quantity: quantity,
        total_price: total_price,
      };
  
      const token = localStorage.getItem("token"); // หรือใช้จาก context / state
  
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/buy-offers/${selectedBuyPost?.post_id}`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken, // CSRF token ต้องส่งไปใน header
            'Content-Type': 'application/json', // ตั้งค่า Content-Type เป็น JSON
          },
          withCredentials: true, // ส่งคุกกี้ CSRF
        }
      )
      .then((response) => {
        console.log("Offer submitted:", response.data);
        router.push(`/farm/to-ship`);
      })
      .catch((error) => {
        console.error("Error submitting offer:", error);
      });
    }
  };
 
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <SideBarFarm />
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {buyPosts.map((post) => (
              <div
                key={post.post_id}
                className="flex flex-col p-6 border rounded-lg shadow-lg bg-white h-full"
              >
                {/* ร้านและรูป */}
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={post.shop_image || "/path/to/default-image.jpg"}
                    alt={post.shop_name}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <h2 className="text-lg font-bold text-gray-800">{post.shop_name}</h2>
                </div>

                {/* รายละเอียดสินค้า */}
                <div className="flex flex-col gap-2 text-left text-black mb-4">
                  <p className="text-md font-semibold text-lg">{post.ingredient_name}</p>
                  <p className="text-md font-semibold">฿ {post.price_per_unit} ต่อ {post.unit}</p>
                  <p className="text-sm text-gray-700">{post.description}</p>
                </div>

                {/* ดันส่วนนี้ลงล่าง */}
                <div className="mt-auto flex flex-col gap-2">
                  {/* กรอบ "รับซื้อ" */}
                  <div className="border border-green-400 bg-green-50 rounded-lg p-2">
                    <p className="text-sm text-green-700 font-semibold">
                      รับซื้อ {post.amount} {post.unit}
                    </p>
                  </div>

                  {/* กรอบ "ซื้อแล้ว" */}
                  <div className="border border-blue-400 bg-blue-50 rounded-lg p-2">
                    <p className="text-sm text-blue-700 font-semibold">
                      ขายแล้ว {post.sold_amount} {post.unit}
                    </p>
                  </div>

                  {/* ปุ่มอยู่ล่างสุดเสมอ */}
                  <Button
                    variant="outline"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                    onClick={() => handleOrderCustomize(post)}
                  >
                    ขายวัตถุดิบ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal */}
      {selectedBuyPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">ยืนยันการขาย</h2>
            <div className="border-b pb-4 mb-6 text-gray-700">
              <p className="text-sm font-semibold">สินค้า: <span className="font-semibold">{selectedBuyPost.ingredient_name}</span></p>
              <p className="text-base font-bold text-gray-900">{selectedBuyPost.price_per_unit} ต่อ {selectedBuyPost.unit}</p>
              <p className="text-base font-bold text-gray-900">จำนวนที่รับซื้อ {selectedBuyPost.amount - selectedBuyPost.sold_amount} {selectedBuyPost.unit}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">จำนวนที่ต้องการขาย ({selectedBuyPost.unit})</label>
              <input
                type="number"
                min="1"
                step="1"
                max={selectedBuyPost.amount - selectedBuyPost.sold_amount}
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setQuantity(value);
                  setTotal_price(value * selectedBuyPost.price_per_unit);
                }}
                onBlur={(e) => {
                  const value = Number(e.target.value);
                  const min = 0.1;
                  const max = selectedBuyPost.amount - selectedBuyPost.sold_amount;

                  if (value < min) {
                    setQuantity(min);
                    setTotal_price(min * selectedBuyPost.price_per_unit);
                  } else if (value > max) {
                    setQuantity(max);
                    setTotal_price(max * selectedBuyPost.price_per_unit);
                  } else {
                    setTotal_price(value * selectedBuyPost.price_per_unit);
                  }
                }}
                className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <p className="text-sm mt-2 font-semibold text-red-500">ราคารวม: {total_price.toFixed(2)} บาท</p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" className="hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg" onClick={closeModal}>
                ยกเลิก
              </Button>
              <Button variant="default" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg" onClick={handleConfirm}>
                ยืนยัน
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopHomePost;
