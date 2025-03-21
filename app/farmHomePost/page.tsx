"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนหน้า

interface Shop {
  shopId: number;
  shopName: string;
  shopImage: string;
  productName: string;
  price: number;
  unit: string;
  amount: number;
  description: string;
  Bought: number;
}

const ShopHomePost = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter(); // ใช้ router สำหรับเปลี่ยนหน้า
  useEffect(() => {
    const fetchShops = async () => {
      const dummyShops: Shop[] = Array.from({ length: 14 }, (_, i) => ({
        shopId: i + 1,
        shopName: `Shop${i + 1}`,
        shopImage: "/placeholder-profile.jpg",
        productName: "ชื่อวัตถุดิบ",
        price: 50,
        unit: "Kg",
        amount: 10,
        description: "รายละเอียด",
        Bought: 2,
      }));
      setShops(dummyShops);
    };
    fetchShops();
  }, []);

  const handleOrderCustomize = (shop: Shop) => {
    setSelectedShop(shop);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedShop(null);
  };

  const handleConfirm = () => {
    const userResponse = confirm("ต้องการดำเนินการต่อหรือไม่?");
          if (userResponse) {
            router.push(`/farmToShip`);
          }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-300 text-white p-6">
          {/* ใส่Sidebar ตรงนี้ */}
        </div>
        {/* Main Content */}
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.shopId}
                className="flex flex-col p-6 border rounded-lg shadow-lg bg-white"
              >
                <div className="flex items-center mb-3">
                  <Image
                    src={shop.shopImage}
                    alt={shop.shopName}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <h2 className="text-lg font-bold text-gray-800">{shop.shopName}</h2>
                </div>
                <div className="text-left text-black">
                  <p className="text-sm">{shop.productName}</p>
                  <p className="text-md font-semibold">{shop.price} ต่อ {shop.unit}</p>
                  <p className="text-sm">{shop.description}</p>
                  <p className="text-sm">รับซื้อ {shop.amount} {shop.unit}</p>
                  <p className="text-sm">ซื้อแล้ว {shop.Bought} {shop.unit}</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => handleOrderCustomize(shop)}
                >
                  ขายวัตถุดิบ
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Modal Popup */}
      {selectedShop && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">ยืนยันการขาย</h2>
      <div className="border-b pb-4 mb-6 text-gray-700">
        <p className="text-sm font-semibold">สินค้า: <span className="font-semibold">{selectedShop.productName}</span></p>
        <p className="text-base font-bold text-gray-900">{selectedShop.price} ต่อ {selectedShop.unit}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">จำนวนที่ต้องการขาย ({selectedShop.unit})</label>
        <input 
          type="number" 
          min="0.01" 
          max={selectedShop.amount} 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))} 
          className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <p className="text-sm mt-2 font-semibold text-red-500">ราคารวม: {selectedShop.price * quantity} บาท</p>
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