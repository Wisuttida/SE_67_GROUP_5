"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Productcard from "@/components/Productcard";
import { testDatabase } from "@/components/testDatabase";

interface Product {
  product_id: number;
  name: string;
  price: string;
  image_url: string | null;
  stock_quantity: number;
  quantity: number;
  gender_target: string;
  fragrance_strength: string;
  shop_name: string;
  shop_image: string;
  volume: number;
  description: string;
  shop_id: number;
}

const ShopPage = () => {
  // รับค่าพารามิเตอร์ shopName จาก URL
  const { shopId } = useParams() as { shopId: string };
  
  // กรองสินค้าตามชื่อร้านค้า
  const shopProducts = testDatabase.filter(
    (product) => product.shop_id === shopId
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{shopId} Shop</h1>
        {shopProducts.length === 0 ? (
          <p>No products available for this shop.</p>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {shopProducts.map((product) => (
              <Productcard key={product.product_id} productEach={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
