"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";  // ปุ่มจาก UI Library ของคุณ
import Navbar from "@/components/Navbar";  // คอมโพเนนต์ Navbar
import Productcard from "@/components/Productcard";

import axios from "axios";

interface Product {
  product_id: number;
  name: string;
  price: string; // or number, depending on how you want to handle prices
  image_url: string | null; // assuming image_url can be null
  image: string;
  stock_quantity: number,
  quantity: number;

}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  // โหลด cart จาก localStorage ตอนโหลดหน้า
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/latest-products`).then(response => {
      setProducts(response.data);
    })
    .catch(error => {
      console.error("Error fetching products:", error);
    });
  }, []);
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section หรือ Banner */}
      {/* <Banner /> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to MyShop</h1>
        <p className="text-xl text-center mb-12">
          Discover the best products for your needs. Shop now!
        </p>

        {/* Product Showcase (รายการสินค้าตัวอย่าง) */}
        <section className="grid grid-cols-3 gap-8">
          {products.slice(0, 9).map((product, index) => (
              <Productcard key={`${product.product_id}-${index}`} productEach={product}/>
          ))}
        </section>

        {/* Call to Action (เช่น โปรโมชั่นหรือข้อเสนอพิเศษ) */}
        <section className="mt-16 text-center">
          <Link href="/product">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Browse All Products
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
