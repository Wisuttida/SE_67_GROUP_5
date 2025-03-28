"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

interface Product {
  product_id: number;
  name: string;
  price: string;
  image_url: string | null;
  stock_quantity: number;
}

interface ProductCardProps {
  productEach: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ productEach }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200" id={`${productEach.product_id}`}>
      <Link href={`/product/${productEach.product_id}`}>
        <img
          src={productEach.image_url || "/path/to/default-image.jpg"}
          alt={productEach.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />

        <h2
          className="text-xl font-semibold text-gray-900 truncate"
          title={productEach.name} // แสดงชื่อเต็มเมื่อ hover
        >
          {productEach.name}
        </h2>
        <p className="text-gray-700 mt-2">฿{parseFloat(productEach.price).toFixed(2)}</p>
      </Link>
    </div>
  );
};

export default ProductCard;
