"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

interface Params {
  params: Promise<{ productId: string }>; // productId มาจาก URL (เป็น Promise)
}

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
  fragrance_tones: { fragrance_tone_id: number; fragrance_tone_name: string }[];
}

function ProductDetailPage({ params }: Params) {
  const resolvedParams = React.use(params); // ใช้ React.use() เพื่อแกะค่าออกจาก Promise
  const productId = resolvedParams?.productId; // productId จาก params ที่ถูกแกะออกมา

  const [showDescription, setShowDescription] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  // ดึงข้อมูลสินค้า
  useEffect(() => {
    if (!productId) return; // ป้องกัน fetch ถ้า productId ยังไม่พร้อม

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
      .then((response) => {
        console.log("Product Data:", response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [productId]);

  // ฟังก์ชันเพิ่มสินค้าเข้าตะกร้า
  const addToCart = () => {
    if (!product) return;

    let updatedCart = [...cart];
    const existingProductIndex = updatedCart.findIndex(
      (item) => item.product_id === product.product_id
    );

    if (existingProductIndex !== -1) {
      updatedCart[existingProductIndex].quantity! += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

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
              src={product?.image_url || "/path/to/default-image.jpg"}
              alt={product?.name || "Product image"}
              className="w-full h-96 object-cover rounded-lg"
            />

            {/* รายละเอียดสินค้า */}
            <div className="flex flex-col justify-between">
              {/* ข้อมูลสินค้า */}
              <div>
                <h2 className="text-3xl font-bold">{product?.name}</h2>
                <p className="text-2xl text-gray-700 mt-2">฿{product?.price}</p>

                <h3 className="text-xl font-semibold mt-5">Product Specifications</h3>
                <ul className="mt-1">

                  <li className="text-lg text-gray-700">
                    <span className="font-semibold">Gender:</span> {product?.gender_target}
                  </li>
                  <li className="text-lg text-gray-700">
                    <span className="font-semibold">Fragrance Strength:</span> {product?.fragrance_strength}
                  </li>
                  <li className="text-lg text-gray-700">
                    <span className="font-semibold">Volume:</span> {product?.volume}
                  </li>
                  <li className="text-lg text-gray-700">
                    <span className="font-semibold">Fragrance Tone:</span>
                    {product?.fragrance_tones.map((tone) => tone.fragrance_tone_name).join(', ')}
                  </li>


                </ul>
              </div>

              {/* ปุ่ม Add to Cart */}
              <Button variant="default" className="mt-6 w-full" onClick={addToCart}>
                Add to Cart
              </Button>
            </div>
          </section>
        </div>

        {/* ข้อมูลร้านค้า */}
        {product && (
          <div className="bg-white p-3 rounded-lg shadow-lg flex items-center mt-4">
            <Link href={`/shop/${product.shop_id}`} className="flex items-center">
              <img
                src={product.shop_image}
                alt={product.shop_name}
                className="w-12 h-12 rounded-full border mr-3"
              />
              <span className="text-lg font-semibold text-black-600">{product.shop_name}</span>
            </Link>
          </div>
        )}

        {/* ปุ่มแสดงรายละเอียด */}
        <Button variant="outline" className="mt-4 w-full" onClick={() => setShowDescription(!showDescription)}>
          {showDescription ? "Hide Product Description" : "Show Product Description"}
        </Button>

        {/* กล่องรายละเอียดสินค้า (ซ่อน/แสดงได้) */}
        {showDescription && product && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg transition-all">
            <h3 className="text-lg font-semibold">Product Description</h3>
            <p className="text-gray-700 mt-2">{product.description}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetailPage;
