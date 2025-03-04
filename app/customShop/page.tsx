"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนหน้า
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Navbar from "@/components/Navbar";

interface Shop {
  shopId: number;
  shopName: string;
  shopImage: string;
}

const ShopListPage = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const router = useRouter(); // ใช้ router สำหรับเปลี่ยนหน้า

  useEffect(() => {
    // จำลองข้อมูลร้านค้า (สามารถเปลี่ยนเป็น fetch API จาก backend)
    const fetchShops = async () => {
      const dummyShops: Shop[] = Array.from({ length: 14 }, (_, i) => ({
        shopId: i + 1,
        shopName: `Shop${i + 1}`,
        shopImage: "/placeholder-profile.jpg", // เปลี่ยนเป็น URL รูปร้านค้าจริง
      }));
      setShops(dummyShops);
    };

    fetchShops();
  }, []);

  // ฟังก์ชันเปลี่ยนหน้าไปยัง custom perfume
  const handleOrderCustomize = (shopId: number) => {
    router.push(`/customPerfume/${shopId}`);
  };

  return (
    <div>
        <Navbar/>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shops That Accept Custom Orders</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shops.map((shop) => (
          <div
            key={shop.shopId}
            className="flex flex-col items-center p-4 border rounded-lg shadow-md"
          >
            <Image
              src={shop.shopImage}
              alt={shop.shopName}
              width={50}
              height={50}
              className="w-16 h-16 rounded-full mb-2"
            />
            <h2 className="font-semibold">{shop.shopName}</h2>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => handleOrderCustomize(shop.shopId)}
            >
              Order Customize
            </Button>
          </div>
        ))}
      </div>
    </div>
    </div>

  );
};

export default ShopListPage;
