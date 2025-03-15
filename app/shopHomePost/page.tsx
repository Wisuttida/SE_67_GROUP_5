"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SideBarShop from "@/components/SideBarShop";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนหน้า

interface Farm {
  farmId: number;
  farmName: string;
  farmImage: string;
  productName: string;
  price: number;
  unit: string;
  amount: number;
  description: string;
  sold: number;
  bankAccount: string;
  bankNumber: string;
  bankName: string;
}

const ShopHomePost = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [slip, setSlip] = useState<File | null>(null);
  const router = useRouter(); // ใช้ router สำหรับเปลี่ยนหน้า

  useEffect(() => {
    const fetchFarms = async () => {
      const dummyFarms: Farm[] = Array.from({ length: 14 }, (_, i) => ({
        farmId: i + 1,
        farmName: `Farm${i + 1}`,
        farmImage: "/placeholder-profile.jpg",
        productName: "ชื่อวัตถุดิบ",
        price: 50,
        unit: "Kg",
        amount: 10,
        description: "รายละเอียด",
        sold: 2,
        bankAccount: "ธนาคารกรุงไทย",
        bankNumber: "123-456-7890",
        bankName: "สมชาย รักษาคน",
      }));
      setFarms(dummyFarms);
    };
    fetchFarms();
  }, []);

  const handleOrderCustomize = (farm: Farm) => {
    setSelectedFarm(farm);
    setQuantity(1);
    setSlip(null);
  };

  const closeModal = () => {
    setSelectedFarm(null);
  };

  const handleConfirmPurchase = () => {
    if (!slip) {
      alert("กรุณาอัปโหลดสลิปก่อนยืนยันการซื้อ");
      return;
    }else{
        const userResponse = confirm("ยืนยันคำสั่งซื้อ");
          if (userResponse) {
            router.push(`/shopToRecieve`);
          }
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-300 text-white p-6">
          <SideBarShop />
        </div>
        {/* Main Content */}
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {farms.map((farm) => (
              <div
                key={farm.farmId}
                className="flex flex-col p-6 border rounded-lg shadow-lg bg-white"
              >
                <div className="flex items-center mb-3">
                  <Image
                    src={farm.farmImage}
                    alt={farm.farmName}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <h2 className="text-lg font-bold text-gray-800">{farm.farmName}</h2>
                </div>
                <div className="text-left text-black">
                  <p className="text-sm">{farm.productName}</p>
                  <p className="text-md font-semibold">{farm.price} ต่อ {farm.unit}</p>
                  <p className="text-sm">ประกาศขาย {farm.amount} {farm.unit}</p>
                  <p className="text-sm">ขายแล้ว {farm.sold} {farm.unit}</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => handleOrderCustomize(farm)}
                >
                  ซื้อวัตถุดิบ
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Modal Popup */}
      {selectedFarm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 max-h-screen overflow-auto flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">ยืนยันการซื้อ</h2>
      <div className="border-b pb-4 mb-6 text-gray-700">
        <p className="text-sm font-semibold">{selectedFarm.farmName}</p>
        <p className="text-sm">บัญชีธนาคาร: <span className="font-semibold">{selectedFarm.bankAccount}</span></p>
        <p className="text-sm">เลขบัญชี: <span className="font-semibold">{selectedFarm.bankNumber}</span></p>
        <p className="text-sm">ชื่อ: <span className="font-semibold">{selectedFarm.bankName}</span></p>
        <p className="text-sm">สินค้า: <span className="font-semibold">{selectedFarm.productName}</span></p>
        <p className="text-base font-bold text-gray-750">{selectedFarm.price} ต่อ {selectedFarm.unit}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">จำนวนที่ต้องการซื้อ</label>
        <input 
          type="number" 
          min="1" 
          max={selectedFarm.amount} 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))} 
          className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <p className="text-sm mt-2 font-semibold text-red-500">ราคารวม: {selectedFarm.price * quantity} บาท</p>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">อัปโหลดสลิปโอนเงิน</label>
        <div className="relative w-full mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100 text-center cursor-pointer hover:bg-gray-200">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setSlip(e.target.files?.[0] || null)} 
            className="w-full opacity-0 absolute inset-0 cursor-pointer"
          />
          <div className="text-gray-500">
            <i className="fa fa-upload text-2xl"></i>
            <p className="text-sm mt-2">ลากหรือคลิกเพื่ออัปโหลด</p>
          </div>
        </div>
        {slip && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">ตัวอย่างสลิป:</p>
            <Image
              src={URL.createObjectURL(slip)}
              alt="Slip Preview"
              width={250}
              height={250}
              className="rounded-lg border shadow-lg mt-2"
            />
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-3 mt-auto">
        <Button variant="outline" className="hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg" onClick={closeModal}>
          ยกเลิก
        </Button>
        <Button variant="default" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg" onClick={handleConfirmPurchase}>
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