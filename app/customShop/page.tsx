"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Shop {
  shop_id: number;
  shop_name: string;
  shop_image: string | null;
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

    // const fetchShops = async () => {
    //   const dummyShops: Shop[] = Array.from({ length: 14 }, (_, i) => ({
    //     shopId: i + 1,
    //     shopName: `Shop${i + 1}`,
    //     shopImage: "/placeholder-profile.jpg",
    //   }));
    //   setShops(dummyShops);
    // };

    // fetchShops();
  }, []);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shops/accepted`, { withCredentials: true })
      .then(response => {
        setShops(response.data.shops);
        console.log(response.data.shops);
      })
      .catch(error => {
        console.error("Error fetching buy posts:", error);
      });
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
    shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase())
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
              key={shop.shop_id}
              className="flex flex-col items-center p-4 border rounded-lg shadow-md"
            >
              {/* ✅ คลิกที่รูปไปร้าน */}
              <img
                src={shop.shop_image || "/path/to/default-image.jpg"}
                alt={shop.shop_name}
                width={50}
                height={50}
                className="w-16 h-16 rounded-full mb-2 cursor-pointer"
                onClick={() => handleGoToShop(shop.shop_id)}
              />
              {/* ✅ คลิกชื่อไปร้าน */}
              <h2
                className="font-semibold cursor-pointer hover:text-blue-600"
                onClick={() => handleGoToShop(shop.shop_id)}
              >
                {shop.shop_name}
              </h2>

              {/* ปุ่ม Order Customize */}
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => handleOrderCustomize(shop.shop_id)}
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
