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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState('');

  // ตรวจสอบสถานะการเข้าสู่ระบบ
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ดึง CSRF Token จาก server
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/csrf-token');
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    
    fetchCsrfToken();
  }, []);

  // ฟังก์ชันเพิ่มสินค้าในตะกร้า
  const addToCart = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!csrfToken) {
      alert("❌ กรุณารอสักครู่ ระบบกำลังโหลดข้อมูล");
      return; // รอจนกว่า CSRF Token จะถูกโหลด
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
        {
          product_id: productEach.product_id,
          quantity: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': localStorage.getItem('csrfToken'),
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      alert("✅ เพิ่มสินค้าในตะกร้าสำเร็จ!");
    } catch (error: any) {
      console.error("Error:", error);
      console.error("Response data:", error.response?.data);
      alert(`❌ ไม่สามารถเพิ่มสินค้าในตะกร้า: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200" id={`${productEach.product_id}`}>
      <Link href={`/product/${productEach.product_id}`}>
        <img
          src={productEach.image_url || "/path/to/default-image.jpg"}
          alt={productEach.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />

      <h2 className="text-xl font-semibold text-gray-900">{productEach.name}</h2>
      <p className="text-gray-700 mt-2">฿{parseFloat(productEach.price).toFixed(2)}</p>
      </Link>

      {/* ปุ่ม Add to Cart */}
      <Button
        variant="default"
        className="mt-4 w-full py-2"
        onClick={addToCart}
        disabled={loading || !csrfToken}
      >
        {loading ? "กำลังเพิ่ม..." : "Add to Cart"}
      </Button>
    </div>
  );
};

export default ProductCard;
