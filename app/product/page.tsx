"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Productcard from "@/components/Productcard";
import FilterSidebar from "@/components/FilterSidebar";
import axios from "axios";

interface Product {
  product_id: number;
  name: string;
  price: string; // or number, depending on how you want to handle prices
  image_url: string | null; // assuming image_url can be null
  image: string;
  stock_quantity: number,
  quantity: number;
  gender_target: string;
  fragrance_strength: string;
  shopName: string;
  shopImage: string;
}

interface CartProduct extends Product {
  quantity: number;
}

const ProductPage = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`).then(response => {
      setProducts(response.data);
      console.log('Products:', JSON.stringify(products));
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
          {filteredProducts.map((product, index) => (
            <Productcard key={`${product.product_id}-${index}`} productEach={product} />
          ))}
        </section>
      </main>
    </div>

  );
};

export default ProductPage;
