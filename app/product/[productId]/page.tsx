"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface Params {
  params: Promise<{ productId: string }>;
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
  shops_shop_id: number;
  status: string;
  fragrance_tones: { fragrance_tone_id: number; fragrance_tone_name: string }[];
}

function ProductDetailPage({ params }: Params) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams?.productId;
   const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]); // รายการสินค้าทั้งหมดในตะกร้า
  const router = useRouter();

  const [showDescription, setShowDescription] = useState(false);


  useEffect(() => {
    if (!productId) return;

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
      .then((response) => {
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
        const response = await axios.get('http://localhost:8000/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      // ดึงข้อมูลสินค้าทั้งหมดในตะกร้า
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      })
        .then((response) => {
          setCartItems(response.data.cart_items);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    }
  }, [isLoggedIn, csrfToken]);

  const addToCart = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);

    // คำนวณจำนวนสินค้าในตะกร้าที่มีอยู่แล้ว
    const existingItem = cartItems.find((item: any) => item.product.product_id === product?.product_id);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1; // เพิ่มจำนวนสินค้า

    try {
      // ส่งคำขอเพิ่มสินค้าลงตะกร้า
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
        {
          product_id: product?.product_id,
          quantity: newQuantity, // จำนวนใหม่ที่เพิ่มขึ้น

        },
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
        }
      );
      toast("✅ เพิ่มสินค้าในตะกร้าสำเร็จ!");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast(`❌ ไม่สามารถเพิ่มสินค้าในตะกร้า: ${error.response?.data?.error || error.message}`);
    }

    setLoading(false);
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
                    <span className="font-semibold">Fragrance Tone: </span>
                    {product?.fragrance_tones.map((tone) => tone.fragrance_tone_name).join(', ')}
                  </li>
                  <li className="text-lg text-gray-700">
                    <span className="font-semibold">Status:</span> {product?.status}
                  </li>
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
            <Link href={`/shop/${product.shops_shop_id}`} className="flex items-center">
              <img
                src={product.shop_image}
                alt={product.shop_name}
                className="w-12 h-12 rounded-full border mr-3"
              />
              <span className="text-lg font-semibold text-black-600">{product.shop_name}</span>
            </Link>
          </div>
        )}

        {/* ปุ่มแสดงรายละเอียดสินค้า */}
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => setShowDescription(!showDescription)}
        >
          {showDescription ? "Hide product detail" : "Show product detail"}
        </Button>

        {/* รายละเอียดสินค้าแบบแสดง/ซ่อน */}
        {showDescription && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg transition-all duration-300">
            <h4 className="text-xl font-semibold mb-2">Product Detail</h4>
            <p className="text-gray-700 text-lg leading-relaxed">
              {product?.description || "ไม่มีรายละเอียดสินค้าเพิ่มเติม"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetailPage;
