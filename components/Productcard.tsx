"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  product_id: number;
  name: string;
  price: string;
  image_url: string | null;
  image: string;
  stock_quantity: number;
  quantity: number;
  gender_target: string;
  fragrance_strength: string;
  shopName: string;
  shopImage: string;
}

interface CartProduct extends Product {
  quantity: number;
}

interface ProductCardProps {
  productEach: Product;
}

const Productcard: React.FC<ProductCardProps> = ({ productEach }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);

  // ✅ โหลดตะกร้าจาก localStorage ตอน component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // ✅ อัปเดต localStorage ทุกครั้งที่ `cart` เปลี่ยน
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = () => {
    // ✅ อ่านค่า cart ล่าสุดจาก localStorage
    const storedCart = localStorage.getItem("cart");
    const currentCart: CartProduct[] = storedCart ? JSON.parse(storedCart) : [];
  
    // ✅ คัดลอกค่ามาแก้ไข
    let updatedCart = [...currentCart];
    
    const existingProductIndex = updatedCart.findIndex(
      (item) => item.product_id === productEach.product_id
    );
  
    if (existingProductIndex !== -1) {
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      updatedCart.push({ ...productEach, quantity: 1 });
    }
  
    // ✅ อัปเดต localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    // ✅ อัปเดต state ให้ตรงกับ localStorage
    setCart(updatedCart);
  };
  

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg" id={`${productEach.product_id}`}>
      <Link href={`/product/${productEach.product_id}`}>
        <img
          src={productEach.image_url || "/path/to/default-image.jpg"}
          alt={productEach.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      </Link>
      <h2 className="text-xl font-semibold mt-4">{productEach.name}</h2>
      <p className="text-gray-700 mt-2">฿{parseFloat(productEach.price).toFixed(2)}</p>

      <Button variant="default" className="mt-4 w-full" onClick={addToCart}>
        Add to Cart
      </Button>
    </div>
  );
};

export default Productcard;
