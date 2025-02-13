"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";  // ปุ่มจาก UI Library ของคุณ
import  Navbar  from "@/components/Navbar";  // คอมโพเนนต์ Navbar
//import { Footer } from "@/components/Footer";  // คอมโพเนนต์ Footer
//import { Banner } from "@/components/Banner";  // คอมโพเนนต์ Banner (ถ้ามี)
import Productcard from "@/components/Productcard";

const ProductPage = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section หรือ Banner */}
      {/* <Banner /> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">

        {/* Product Showcase (รายการสินค้าตัวอย่าง) */}
        <section className="grid grid-cols-3 gap-8">
          <Productcard/>
          <Productcard/>
          <Productcard/>
          <Productcard/>
          <Productcard/>
          <Productcard/>
          <Productcard/>
          <Productcard/>
          <Productcard/>
          <Productcard/>
        </section>

        {/* Call to Action (เช่น โปรโมชั่นหรือข้อเสนอพิเศษ) */}
        <section className="mt-16 text-center">
          <Link href="/shop">
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

export default ProductPage;


