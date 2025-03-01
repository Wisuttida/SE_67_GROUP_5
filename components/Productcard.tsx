"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  productId: number;
  name: string;
  price: number;
  quantity?: number;
  shopName: string; // เพิ่มชื่อร้านค้า
  shopImage: string; // เพิ่มรูปโปรไฟล์ร้านค้า
}

const Productcard = ({ product }: { product: Product }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // โหลด cart จาก localStorage ตอนโหลดหน้า
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = () => {
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

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      {/* ข้อมูลร้านค้าอยู่ด้านบน */}
      <div className="flex items-center mb-3">
        <img
          src={product.shopImage}
          alt={product.shopName}
          className="w-10 h-10 rounded-full mr-2"
        />
        {/* ทำให้ชื่อร้านค้ากดได้ */}
        <Link href={`/shop/${product.shopName}`}>
          <span className="text-sm font-semibold text-black-500">
            {product.shopName}
          </span>
        </Link>
      </div>

      <Link href={`/product/${product.productId}`}>
        <img
          src="/path/to/product1.jpg"
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      </Link>
        <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
        <p className="text-gray-700 mt-2">${product.price.toFixed(2)}</p>

      <Button variant="default" className="mt-4 w-full" onClick={addToCart}>
        Add to Cart
      </Button>
    </div>
  );
};

export default Productcard;
