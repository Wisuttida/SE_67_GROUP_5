"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { testDatabase } from "@/components/testDatabase";
import axios from "axios";

interface Params {
  params: Promise<{ productId: number }>;
}

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
  shop_name: string;
  shop_image: string;
  volume: number;
  description: string;
}


function ProductdetailPage({ params }: Params) {
  const resolvedParams = React.use(params);
  const [showDetails, setShowDetails] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`).then(response => {
      console.log(response.data);
      setProducts(response.data);
    })
    .catch(error => {
      console.error("Error fetching products:", error);
    });
  }, []);
  const product = products.find((p) => p.product_id == resolvedParams.productId);
  
  // const storedCart = localStorage.getItem("cart");   รอทำ async
  // if (storedCart) {
  //   setCart(JSON.parse(storedCart));
  // }
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
              alt={product?.name}
              className="w-full h-96 object-cover rounded-lg"
            />

            {/* รายละเอียดสินค้า */}
            <div className="flex flex-col justify-between">
              {/* ข้อมูลสินค้า */}
              <div>
                <h2 className="text-3xl font-bold">{product?.name}</h2>
                <p className="text-2xl text-gray-700 mt-2">
                  ฿{product?.price}
                </p>


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
        </div>

        <div className="bg-white p-3 rounded-lg shadow-lg flex items-center mt-4 ">
          <Link
            href={`/shop/${product?.shop_name}`}
            className="flex items-center"
          >
            <img
              src={product?.shop_image}
              alt={product?.shop_name}
              className="w-12 h-12 rounded-full border mr-3"
            />
            <span className="text-lg font-semibold text-black-600">
              {product?.shop_name}
            </span>
          </Link>
        </div>
        
        <div>
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
                {product?.description}
              </p>
            </div>
          )}
          </div>
      </main>
    </div>
  );
}

export default ProductdetailPage;
