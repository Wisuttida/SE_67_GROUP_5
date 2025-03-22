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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

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
      console.error("Response data:", error.response?.data); // Log the response data
      alert(`❌ ไม่สามารถเพิ่มสินค้าในตะกร้า: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
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

      <Button variant="default" className="mt-4 w-full" onClick={addToCart} disabled={loading}>
        {loading ? "กำลังเพิ่ม..." : "Add to Cart"}
      </Button>
    </div>
  );
};

export default ProductCard;
