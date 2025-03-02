"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  gender: string,
  age: number,
  fragranceTone: string,
  fragranceStrength: string,

}

const Productcard = ({ product }: { product: Product }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [products, setProducts] = useState([]);
  // โหลด cart จาก localStorage ตอนโหลดหน้า
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products").then(response => {
      setProducts(response.data);
    })
    .catch(error => {
      console.error("Error fetching products:", error);
    });
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
