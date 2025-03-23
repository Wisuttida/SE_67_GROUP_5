"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Productcard from "@/components/Productcard";
import axios from "axios";

interface Product {
  product_id: number;
  name: string;
  price: string;
  image_url: string | null;
  volume: string;
  shop_name: string;
  shop_image: string;
  stock_quantity: number;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [genderFilters, setGenderFilters] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");

  // ดึงข้อมูลจาก API พร้อม filter
  const fetchProducts = () => {
    const params: any = {};
    if (genderFilters.length > 0) params.gender_target = genderFilters;
    if (search) params.search = search;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products`, { params })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, [genderFilters]);

  const handleGenderChange = (gender: string) => {
    setGenderFilters((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 flex gap-8 items-start">
        {/* Sidebar Filter */}
        <aside className="w-1/4 p-4 border rounded h-[calc(100vh-64px)] sticky top-16 bg-white">
          <h2 className="text-xl font-semibold mb-4">Filter</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="ค้นหาสินค้า"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <button
            onClick={fetchProducts}
            className="bg-black text-white py-2 px-4 rounded w-full"
          >
            ค้นหา
          </button>

          {/* Gender Filter */}
          <div className="mt-6">
            <p className="font-semibold mb-2">Gender Target</p>
            {["Male", "Female", "Unisex"].map((gender) => (
              <label key={gender} className="block mb-2">
                <input
                  type="checkbox"
                  value={gender}
                  checked={genderFilters.includes(gender)}
                  onChange={() => handleGenderChange(gender)}
                  className="mr-2"
                />
                {gender}
              </label>
            ))}
          </div>
        </aside>

        {/* Product Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-3/4">
          {products.map((product, index) => (
            <Productcard key={`${product.product_id}-${index}`} productEach={product} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProductPage;
