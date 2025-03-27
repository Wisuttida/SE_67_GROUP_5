"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SideBarShop from "@/components/SideBarShop";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนหน้า
import axios from "axios";

// interface Farm {
//   farm_id: string;
//   farm_name: string;
//   farm_image: string;
//   name: string;
//   price_per_unit: number;
//   unit: string;
//   amount: number;
//   description: string;
//   sold: number;
//   bank_account: string;
//   bank_number: string;
//   bank_name: string;
// }

interface SalePost {
  post_id: number;
  farm_id: number;
  farm_image: string | null;
  farm_name: string;
  description: string;
  price_per_unit: number;
  amount: number;
  unit: string;
  ingredient_name: string;
  status: string;
  sold_amount: number;
}

const ShopHomePost = () => {
  //const [farms, setFarms] = useState<Farm[]>([]);
  //const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter(); // ใช้ router สำหรับเปลี่ยนหน้า

  const [salePosts, setSalePosts] = useState<SalePost[]>([]);
  const [selectedSalePost, setSelectedSalePost] = useState<SalePost | null>(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/show-salesposts`, { 
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true // ตรวจสอบคุกกี้ CSRF
    })
    .then(response => {
      console.log(response.data); // Check if data is correct
      const updatedsalesPosts = response.data.sales_posts.map((post: any) => ({
        ...post,
        price_per_unit: Number(post.price_per_unit),
        amount: Number(post.amount),
        sold_amount: Number(post.sold_amount),
      }));
      setSalePosts(updatedsalesPosts);
    })
    .catch(error => {
      console.error("Error fetching sales posts:", error);
    });    
  }, []);
  

  useEffect(() => {
    const fetchFarms = async () => {
      const dummyFarms: SalePost[] = Array.from({ length: 14 }, (_, i) => ({
        farm_id: "${i + 1}",
        farm_name: `Farm${i + 1}`,
        farm_image: "/placeholder-profile.jpg",
        name: "ชื่อวัตถุดิบ",
        price_per_unit: 50,
        unit: "Kg",
        amount: 10,
        description: "รายละเอียด",
        sold: 2,
        bank_account: "ธนาคารกรุงไทย",
        bank_number: "123-456-7890",
        bank_name: "สมชาย รักษาคน",
      }));
      setSalePosts(dummyFarms);
    };
    fetchFarms();
  }, []);

  const handleOrderCustomize = (farm: SalePost) => {
    setSelectedSalePost(farm);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedSalePost(null);
  };

  const handleConfirmPurchase = (farmId: number) => {
    if (!slipPreviews[farmId]) {
      alert("กรุณาอัปโหลดสลิปก่อนยืนยันการซื้อ");
      return;
    } else {
      const userResponse = confirm("ยืนยันคำสั่งซื้อ");
      if (userResponse) {
        router.push(`/shopToRecieve`);
      }
    }

  };
  const [slipPreviews, setSlipPreviews] = useState<{ [key: string]: string }>({});
  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>, sellerId: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSlipPreviews(prev => ({ ...prev, [sellerId]: reader.result as string }));
      };
      reader.readAsDataURL(file);
      e.target.value = ""; // รีเซ็ตค่า input
    }
  };
  const removePreview = (sellerId: number) => {
    setSlipPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[sellerId];
      return newPreviews;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <div>
          <SideBarShop />
        </div>
        {/* Main Content */}
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {salePosts.map((post) => {
          console.log(post.post_id); // Log post_id to verify it is always unique and defined
          return (
            <div
            key={post.post_id} // Ensure post_id is unique
          className="flex flex-col p-6 border rounded-lg shadow-lg bg-white"
          >
                <div className="flex items-center mb-3">
                  <Image
                    src={post.farm_image || "/path/to/default-image.jpg"}
                    alt={post.farm_name}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <h2 className="text-lg font-bold text-gray-800">{post.farm_name}</h2>
                </div>
                <div className="text-left text-black">
                <p className="text-md font-semibold text-lg">{post.ingredient_name}</p>
                <p className="text-sm text-gray-700">{post.description}</p>
                  <p className="text-md font-semibold">{post.price_per_unit} ต่อ {post.unit}</p>
                  <p className="text-sm">ประกาศขาย {post.amount} {post.unit}</p>
                  <div className="border border-blue-400 bg-blue-50 rounded-lg p-2">
                    <p className="text-sm text-blue-700 font-semibold">
                    ขายแล้ว {post.sold_amount} {post.unit}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => handleOrderCustomize(post)}
                >
                  ซื้อวัตถุดิบ
                </Button>
              </div>
            )})}
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedSalePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 max-h-screen overflow-auto flex flex-col">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">ยืนยันการซื้อ</h2>
            <div className="border-b pb-4 mb-6 text-gray-700">
              {/* <p className="text-sm font-semibold">{selectedSalePost.farm_name}</p>
              <p className="text-sm">บัญชีธนาคาร: <span className="font-semibold">{selectedSalePost.bank_account}</span></p>
              <p className="text-sm">เลขบัญชี: <span className="font-semibold">{selectedSalePost.bank_number}</span></p>
              <p className="text-sm">ชื่อ: <span className="font-semibold">{selectedSalePost.bank_name}</span></p> */}
              <p className="text-sm">สินค้า: <span className="font-semibold">{selectedSalePost.ingredient_name}</span></p>
              <p className="text-base font-bold text-gray-750">{selectedSalePost.price_per_unit} ต่อ {selectedSalePost.unit}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">จำนวนที่ต้องการซื้อ</label>
              <input
                type="number"
                min="1"        // กำหนดขั้นต่ำที่ 0 หรือปรับตามต้องการ
                step="1"
                max={selectedSalePost.amount - selectedSalePost.sold_amount}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                onBlur={(e) => {
                  const value = Number(e.target.value);
                  const min = 1; // กำหนดค่า min
                  const max = selectedSalePost.amount - selectedSalePost.sold_amount; // กำหนดค่า max
                  if (value < min) {
                    setQuantity(min); // ถ้าค่าน้อยกว่า min ให้ปรับเป็น min
                  } else if (value > max) {
                    setQuantity(max); // ถ้าค่ามากกว่า max ให้ปรับเป็น max
                  }
                }}
                className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <p className="text-sm mt-2 font-semibold text-red-500">ราคารวม: {selectedSalePost.price_per_unit * quantity} บาท</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">อัปโหลดสลิปโอนเงิน</label>
              <div className="relative w-full mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100 text-center cursor-pointer hover:bg-gray-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSlipUpload(e, selectedSalePost.farm_id)}
                  className="w-full opacity-0 absolute inset-0 cursor-pointer"
                />
                <div className="text-gray-500">
                  <i className="fa fa-upload text-2xl"></i>
                  <p className="text-sm mt-2">ลากหรือคลิกเพื่ออัปโหลด</p>
                </div>
              </div>
              {slipPreviews[selectedSalePost.farm_id] && (
                <div className="mt-3 relative inline-block"> {/* เพิ่ม relative ที่นี่ */}
                  <p className="text-gray-700">ตัวอย่างสลิป:</p>
                  <img
                    src={slipPreviews[selectedSalePost.farm_id]}
                    alt="Slip Preview"
                    className="w-full h-auto rounded-lg shadow-md border mt-2"
                  />
                  {/* ปุ่มกากบาท */}
                  <button
                    onClick={() => removePreview(selectedSalePost.farm_id)} // ใช้ seller.id แทนการฮาร์ดโค้ด
                    className="absolute top-8 right-1 bg-gray-500 text-white rounded-full p-1 shadow hover:bg-gray-600 transition opacity-10absolute top-2 right-2 bg-gray-500 text-white rounded-full p-2 shadow opacity-50 hover:opacity-100 hover:bg-gray-600 transition0 hover:opacity-500"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-auto">
              <Button variant="outline"
                className={`w-1/2 py-2 rounded-md text-center ${slipPreviews[selectedSalePost.farm_id] ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 text-white"}`}
                disabled={!!slipPreviews[selectedSalePost.farm_id]}
                onClick={closeModal}>
                ยกเลิก
              </Button>
              <Button variant="default" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg" onClick={() => handleConfirmPurchase(selectedSalePost.farm_id)}>
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