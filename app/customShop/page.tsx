"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";

interface Shop {
  shopId: number;
  shopName: string;
  shopImage: string;
}

const ShopListPage = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    const fetchShops = async () => {
      const dummyShops: Shop[] = Array.from({ length: 14 }, (_, i) => ({
        shopId: i + 1,
        shopName: `Shop${i + 1}`,
        shopImage: "/placeholder-profile.jpg",
      }));
      setShops(dummyShops);
    };

    fetchShops();
  }, []);

  // ไปหน้าสร้างน้ำหอม
  const handleOrderCustomize = (shopId: number) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    
    router.push(`/customPerfume/${shopId}`);
  };

  // ✅ ไปหน้า shop เมื่อคลิกชื่อร้านหรือรูป
  const handleGoToShop = (shopId: number) => {
    router.push(`/shop/${shopId}`);
  };

  const filteredShops = shops.filter((shop) =>
    shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Shops That Accept Custom Orders</h1>

        {/* Search Box */}
        <Input
          type="text"
          placeholder="Search shops..."
          className="mb-6 w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Shop List */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredShops.map((shop) => (
            <div
              key={shop.shopId}
              className="flex flex-col items-center p-4 border rounded-lg shadow-md"
            >
              {/* ✅ คลิกที่รูปไปร้าน */}
              <Image
                src={shop.shopImage}
                alt={shop.shopName}
                width={50}
                height={50}
                className="w-16 h-16 rounded-full mb-2 cursor-pointer"
                onClick={() => handleGoToShop(shop.shopId)}
              />
              {/* ✅ คลิกชื่อไปร้าน */}
              <h2
                className="font-semibold cursor-pointer hover:text-blue-600"
                onClick={() => handleGoToShop(shop.shopId)}
              >
                {shop.shopName}
              </h2>

              {/* ปุ่ม Order Customize */}
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

        {/* ถ้าไม่เจอร้าน */}
        {filteredShops.length === 0 && (
          <p className="text-gray-500 mt-4">No shops found.</p>
        )}
      </div>
    </div>
  );
};

export default ShopListPage;
