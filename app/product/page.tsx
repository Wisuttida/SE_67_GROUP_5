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
  fragrance_tones: { fragrance_tone_id: number; fragrance_tone_name: string }[];
}

const genderOptions = [
  { label: "ชาย", value: "male" },
  { label: "หญิง", value: "female" },
  { label: "ยูนิเซ็กซ์", value: "unisex" },
];

const strengthOptions = [
  { label: "Extrait de Parfum", value: "extrait de parfum"},
  { label: "Eau de Parfum (EDP)", value: "eau de parfum (edp)"},
  { label: "Eau de Toilette (EDT)", value: "eau de toilette (edt)"},
  { label: "Eau de Cologne (EDC)", value: "eau de cologne (edc)"},
  { label: "Eau Fraiche/mists", value: "eau fraiche/mists"},
];

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // State สำหรับ filter
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);

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

  const handleStrengthChange = (strength: string) => {
    if (selectedStrengths.includes(strength)) {
      setSelectedStrengths(selectedStrengths.filter(s => s !== strength));
    } else {
      setSelectedStrengths([...selectedStrengths, strength]);
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

    // กรองตามเพศ (gender) แบบ checkbox (แก้ให้รองรับหลาย gender)
    if (selectedGenders.length > 0) {
      if (!selectedGenders.includes(product.gender_target.toLowerCase())) {
        return false;
      }
    }

    // Filter Fragrance Strength
    if (selectedStrengths.length > 0) {
      if (!selectedStrengths.includes(product.fragrance_strength.toLowerCase())) {
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
            {genderOptions.map((gender) => (
              <div key={gender.value} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={gender.value}
                  value={gender.value}
                  checked={selectedGenders.includes(gender.value)}
                  onChange={(e) => handleGenderChange(gender.value)}
                  className="mr-2"
                />
                <label htmlFor={gender.value}>{gender.label}</label>
              </div>
            ))}
          </div>

          {/* Filter Fragrance Strength */}
          <div className="mb-4">
            <span className="block mb-1 font-semibold">Fragrance Strength:</span>
            {strengthOptions.map((strength) => (
              <div key={strength.value} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={strength.value}
                  value={strength.value}
                  checked={selectedStrengths.includes(strength.value)}
                  onChange={() => handleStrengthChange(strength.value)}
                  className="mr-2"
                />
                <label htmlFor={strength.value}>{strength.label}</label>
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
