"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Productcard from "@/components/Productcard";
import FilterComponent from "@/components/FilterSidebar";
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
  fragrance_tones: { fragrance_tone_name: string };
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // State สำหรับ filter
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          console.log(response.data);
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

  const handleToneChange = (tone: string) => {
    if (selectedTones.includes(tone)) {
      setSelectedStrengths(selectedTones.filter(t => t !== tone));
    } else {
      setSelectedTones([...selectedTones, tone]);
    }
  };

  // กรองข้อมูลสินค้าตาม filter ที่ระบุ
  const filteredProducts = products.filter((product) => {
    const productPrice = parseFloat(product.price);

    // กรองราคาขั้นต่ำ
    if (minPrice && productPrice < parseFloat(minPrice)) {
      return false;
    }

    if (maxPrice && productPrice > parseFloat(maxPrice)) {
      return false;
    }

    if (searchName && !product.name.toLowerCase().includes(searchName.toLowerCase())) {
      return false;
    }

    if (selectedGenders.length > 0 && !selectedGenders.includes(product.gender_target.toLowerCase())) {
      return false;
    }

    if (selectedStrengths.length > 0 && !selectedStrengths.includes(product.fragrance_strength.toLowerCase())) {
      return false;
    }

    if (selectedTones.length > 0 && !selectedTones.includes(product.fragrance_tones.fragrance_tone_name.toLowerCase())) {
      return false;
  }

    return true;
  });

  return (
    <div>
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 flex gap-8 items-start">
        {/* ใช้ FilterComponent */}
        <FilterComponent
          minPrice={minPrice}
          maxPrice={maxPrice}
          searchName={searchName}
          selectedGenders={selectedGenders}
          selectedStrengths={selectedStrengths}
          selectedTones={selectedTones}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          setSearchName={setSearchName}
          handleGenderChange={handleGenderChange}
          handleStrengthChange={handleStrengthChange}
          handleToneChange={handleToneChange}/>

        {/* ส่วนแสดงสินค้า */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-3/4">
          {filteredProducts.map((product) => (
            <Productcard key={product.product_id} productEach={product} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProductPage;
