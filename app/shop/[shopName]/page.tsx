"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Productcard from "@/components/Productcard";
import { testDatabase } from "@/components/testDatabase";

const ShopPage = () => {
  // รับค่าพารามิเตอร์ shopName จาก URL
  const { shopName } = useParams() as { shopName: string };
  
  // กรองสินค้าตามชื่อร้านค้า
  const shopProducts = testDatabase.filter(
    (product) => product.shopName === shopName
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{shopName} Shop</h1>
        {shopProducts.length === 0 ? (
          <p>No products available for this shop.</p>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {shopProducts.map((product) => (
              <Productcard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
