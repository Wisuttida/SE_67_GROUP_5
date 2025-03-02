"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Productcard from "@/components/Productcard";
import FilterSidebar from "@/components/FilterSidebar";
import axios from "axios";

interface Product {
  product_id: number;
  name: string;
  price: string; // or number, depending on how you want to handle prices
  image_url: string | null; // assuming image_url can be null
}

const ProductPage = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  // โหลด cart จาก localStorage ตอนโหลดหน้า
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products").then(response => {
      setProducts(response.data);
      //console.log('geeee', response.data);
    })
    .catch(error => {
      console.error("Error fetching products:", error);
    });
  }, []);
  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    if (selectedFilters.length === 0) return true;
    
    // For now, we'll just filter by price since that's the only field we have
    return selectedFilters.every((filter) => {
      // If the filter is a number (price filter)
      if (filter.match(/^\d+$/)) {
        return parseFloat(product.price) >= Number(filter);
      }
      return true; // Skip other filters for now
    });
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
            <Productcard key={product.product_id} productEach={product} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProductPage;
