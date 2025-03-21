"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const [product, setProduct] = useState<Product | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState('');

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/csrf-token');
        //console.log('CSRF Token:', response.data.csrf_token); // Log the token
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  // ฟังก์ชันเพิ่มสินค้าเข้าตะกร้า
  const addToCart = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // const token = localStorage.getItem("token");
      console.log('ADD...');
      // console.log('Sending request with headers:', {
      //   'Content-Type': 'application/json',
      //   'Accept': 'application/json',
      //   'X-Requested-With': 'XMLHttpRequest',
      //   'X-CSRF-TOKEN': csrfToken,
      // });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
        {
          product_id: productId,
          quantity: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      alert("✅ เพิ่มสินค้าในตะกร้าสำเร็จ!");
    } catch (error: any) {
      console.error("Error:", error);
      console.error("Response data:", error.response?.data); // Log the response data
      alert(`❌ ไม่สามารถเพิ่มสินค้าในตะกร้า: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
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
                  {/* <li className="text-lg text-gray-700">
                    <span className="font-semibold">Stock Quantity:</span> {product?.stock_quantity}
                  </li> */}

                </ul>
              </div>

              {/* ปุ่ม Add to Cart */}
              <Button variant="default" className="mt-6 w-full" onClick={addToCart} disabled={loading || !csrfToken}>
              {loading ? "กำลังเพิ่ม..." : "Add to Cart"}
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
