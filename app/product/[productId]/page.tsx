import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

import { testDatabase } from "@/components/testDatabase";

interface Params {
  params: { productId: string }; // มาจาก URL จะเป็น string
}

function ProductdetailPage({ params }: Params) {
  const productIdNumber = Number(params.productId); // แปลงเป็น number
  const product = testDatabase.find((p) => p.productId === productIdNumber); // หา product ตาม id

  if (!product) {
    return (
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto p-6 text-center">
          <h2 className="text-xl font-semibold mt-4 text-red-500">Product not found</h2>
        </main>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
          <section className="grid grid-cols-2 gap-8">
            {/* รูปสินค้า */}
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />

            {/* รายละเอียดสินค้า */}
            <section className="grid grid-rows-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
                <p className="text-gray-700 mt-2">${product.price.toFixed(2)}</p>
              </div>
              <Button variant="default" className="mt-4 w-full">Add to Cart</Button>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProductdetailPage;
