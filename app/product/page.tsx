"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Productcard from "@/components/Productcard";
import FilterSidebar from "@/components/FilterSidebar";
import { testDatabase } from "@/components/testDatabase";

const ProductPage = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // ฟังก์ชันกรองสินค้าตามราคาที่เลือก
  const filteredProducts = testDatabase.filter((product) => {
    if (selectedFilters.length === 0) return true; // ถ้าไม่เลือก filter ให้แสดงสินค้าทั้งหมด
    return selectedFilters.some((price) => product.price >= Number(price));
  });

  return (
    <div>
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 flex gap-8">
        {/* Sidebar Filter */}
        <aside className="w-1/4">
          <FilterSidebar 
            selectedFilters={selectedFilters} 
            setSelectedFilters={setSelectedFilters} 
          />
        </aside>

        {/* Product Showcase */}
        <section className="grid grid-cols-3 gap-8 w-3/4">
          {filteredProducts.map((product) => (
            <Productcard key={product.productId} product={product} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProductPage;
