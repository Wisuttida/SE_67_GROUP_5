"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนหน้า
import SideBarFarm from "@/components/SideBarFarm";

interface Shop {
  shop_id: number;
  shop_name: string;
  shop_image: string;
  name: string; // ingrediant name
  price_per_unit: number;
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
  const [total_price, setTotal_price] = useState<number>(0);

  useEffect(() => {
    const fetchShops = async () => {
      const dummyShops: Shop[] = Array.from({ length: 14 }, (_, i) => ({
        shop_id: i + 1,
        shop_name: `Shop${i + 1}`,
        shop_image: "/placeholder-profile.jpg",
        name: "ชื่อวัตถุดิบ",
        price_per_unit: 50,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const orderData = {
        shop_id: selectedShop?.shop_id,
        quantity: quantity,
        total_price: total_price, // ราคารวม
      };
      router.push(`/farm/to-ship`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <div>
          <SideBarFarm/>
        </div>
        {/* Main Content */}
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.shop_id}
                className="flex flex-col p-6 border rounded-lg shadow-lg bg-white"
              >
                <div className="flex items-center mb-3">
                  <Image
                    src={shop.shop_image}
                    alt={shop.shop_name}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <h2 className="text-lg font-bold text-gray-800">{shop.shop_name}</h2>
                </div>
                <div className="text-left text-black">
                  <p className="text-sm">{shop.name}</p>
                  <p className="text-md font-semibold">{shop.price_per_unit} ต่อ {shop.unit}</p>
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
        <p className="text-sm font-semibold">สินค้า: <span className="font-semibold">{selectedShop.name}</span></p>
        <p className="text-base font-bold text-gray-900">{selectedShop.price_per_unit} ต่อ {selectedShop.unit}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">จำนวนที่ต้องการขาย ({selectedShop.unit})</label>
        <input 
          type="number" 
          min="0.1"        // กำหนดขั้นต่ำที่ 0 หรือปรับตามต้องการ
          step="0.5" 
          max={selectedShop.amount - selectedShop.Bought} 
          value={quantity} 
          onChange={(e) => {
            const value = Number(e.target.value);
            setQuantity(value);
            setTotal_price(value * selectedShop.price_per_unit); // คำนวณราคารวม
          }}
          onBlur={(e) => {
            const value = Number(e.target.value);
            const min = 0.1; // กำหนดค่า min
            const max = selectedShop.amount - selectedShop.Bought; // กำหนดค่า max

            if (value < min) {
              setQuantity(min); // ถ้าค่าน้อยกว่า min ให้ปรับเป็น min
              setTotal_price(min * selectedShop.price_per_unit);
            } else if (value > max) {
              setQuantity(max); // ถ้าค่ามากกว่า max ให้ปรับเป็น max
              setTotal_price(min * selectedShop.price_per_unit);
            }else {
              setTotal_price(value * selectedShop.price_per_unit);
            }
          }}  
          className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <p className="text-sm mt-2 font-semibold text-red-500">ราคารวม: {selectedShop.price_per_unit * quantity} บาท</p>
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