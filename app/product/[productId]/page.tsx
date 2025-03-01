"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { testDatabase } from "@/components/testDatabase";

interface Params {
  params: Promise<{ productId: string }>;
}

interface Product {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  shopName: string;
  shopImage: string;
}

function ProductdetailPage({ params }: Params) {
  // แกะค่า params ด้วย React.use()
  const resolvedParams = React.use(params);
  const productIdNumber = Number(resolvedParams.productId);
  const product = testDatabase.find((p) => p.productId === productIdNumber);
  const [showDetails, setShowDetails] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);

  // โหลด cart จาก localStorage ตอนโหลดหน้า
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = () => {
    if (!product) return;
    let updatedCart = [...cart];
    const existingProductIndex = updatedCart.findIndex(
      (item) => item.productId === product.productId
    );

    if (existingProductIndex !== -1) {
      updatedCart[existingProductIndex].quantity! += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  if (!product) {
    return (
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto p-6 text-center">
          <h2 className="text-xl font-semibold mt-4 text-red-500">
            Product not found
          </h2>
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
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <section className="grid grid-cols-2 gap-8">
            {/* รูปสินค้า */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />

            {/* รายละเอียดสินค้า */}
            <div className="flex flex-col justify-between">
              {/* ข้อมูลสินค้า */}
              <div>
                <h2 className="text-3xl font-bold">{product.name}</h2>
                <p className="text-2xl text-gray-700 mt-2">
                  ${product.price.toFixed(2)}
                </p>
                {/* ข้อมูลร้านค้า */}
                <div className="flex items-center mt-4">
                  <Link
                    href={`/shop/${encodeURIComponent(product.shopName)}`}
                    className="flex items-center"
                  >
                    <img
                      src={product.shopImage}
                      alt={product.shopName}
                      className="w-12 h-12 rounded-full border mr-3"
                    />
                    <span className="text-lg font-semibold text-black-600">
                      {product.shopName}
                    </span>
                  </Link>
                </div>

              </div>

              {/* ปุ่ม Add to Cart */}
              <Button
                variant="default"
                className="mt-6 w-full"
                onClick={addToCart}
              >
                Add to Cart
              </Button>
            </div>
          </section>

          {/* ปุ่มแสดงรายละเอียด */}
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>

          {/* กล่องรายละเอียดสินค้า (ซ่อน/แสดงได้) */}
          {showDetails && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg transition-all">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <p className="text-gray-700 mt-2">
                This is a high-quality perfume made with the finest ingredients.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProductdetailPage;
