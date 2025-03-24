"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Productcard from "@/components/Productcard";
import axios from "axios";

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

const genderOptions = [
  { label: "ชาย", value: "male" },
  { label: "หญิง", value: "female" },
  { label: "ยูนิเซ็กซ์", value: "unisex" },
];

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  // State สำหรับ filter
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("ข้อมูลที่ได้รับไม่ใช่ Array:", response.data);
        }
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
    }, []);
  // ฟังก์ชันจัดการเปลี่ยนแปลง checkbox สำหรับ gender
  const handleGenderChange = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter(g => g !== gender));
    } else {
      setSelectedGenders([...selectedGenders, gender]);
    }
  };

  // กรองข้อมูลสินค้าตาม filter ที่ระบุ
  const filteredProducts = products.filter((product) => {
    const productPrice = parseFloat(product.price);

    // กรองราคาขั้นต่ำ
    if (minPrice && productPrice < parseFloat(minPrice)) {
      return false;
    }

    // กรองราคาขั้นสูง
    if (maxPrice && productPrice > parseFloat(maxPrice)) {
      return false;
    }

    // กรองตามชื่อสินค้า (ไม่คำนึงถึงตัวพิมพ์เล็กใหญ่)
    if (searchName && !product.name.toLowerCase().includes(searchName.toLowerCase())) {
      return false;
    }

    // กรองตามเพศ (gender) แบบ checkbox
    if (selectedGenders) {
      if (product.gender_target.toLowerCase() === selectedGenders[0]) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 flex gap-8 items-start">
        {/* Sidebar สำหรับ filter ด้วยความยาวคงที่ */}
        <aside className="w-1/4 p-4 border rounded h-[calc(100vh-64px)] sticky top-16">
          <h2 className="text-xl font-semibold mb-4">กรองสินค้า</h2>

          {/* Filter ราคา */}
          <div className="mb-4">
            <label className="block mb-1">ราคาขั้นต่ำ:</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border p-1 rounded w-full"
              placeholder="0"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">ราคาขั้นสูง:</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border p-1 rounded w-full"
              placeholder="1000"
            />
          </div>

          {/* Filter ค้นหาชื่อ */}
          <div className="mb-4">
            <label className="block mb-1">ค้นหาชื่อ:</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border p-1 rounded w-full"
              placeholder="ค้นหาสินค้า..."
            />
          </div>

          {/* Filter เพศ (gender) แบบ checkbox */}
          <div>
            <span className="block mb-1 font-semibold">เพศ:</span>
            {genderOptions.map((option) => (
              <div key={option.value} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={option.value}
                  value={option.value}
                  checked={selectedGenders.includes(option.value)}
                  onChange={(e) => handleGenderChange(option.value)}
                  className="mr-2"
                />
                <label htmlFor={option.value}>{option.label}</label>
              </div>
            ))}
          </div>
        </aside>

        {/* ส่วนแสดงสินค้า */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-3/4">
          {filteredProducts.map((product, index) => (
            <Productcard key={`${product.product_id}-${index}`} productEach={product} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProductPage;
