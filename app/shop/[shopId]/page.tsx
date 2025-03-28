"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Productcard from "@/components/Productcard";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import FilterComponent from "@/components/FilterSidebar";

interface Product {
  product_id: number;
  name: string;
  price: string;
  image_url: string | null;
  stock_quantity: number;
  quantity: number;
  gender_target: string;
  fragrance_strength: string;
  shop_name: string;
  shop_image: string;
  volume: number;
  description: string;
  shops_shop_id: number;
  fragrance_tones: { fragrance_tone_name: string };
}

const ShopPage = () => {
  const { shopId } = useParams() as { shopId: string };

  if (!shopId) {
    console.error("Shop ID is missing from the URL.");
    return <p>Shop ID is missing from the URL.</p>;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [shopDetails, setShopDetails] = useState({
    shop_name: "Shop Name",
    shop_image: "/placeholder-profile.jpg",
    description: "No description available.",
  });

  // Filter state
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        console.log("Response data:", response.data);

        if (Array.isArray(response.data)) {
          const filteredProducts = response.data.filter(
            (product: Product) => product.shops_shop_id.toString() === shopId
          );

          setProducts(filteredProducts);

          if (filteredProducts.length > 0) {
            setShopDetails({
              shop_name: filteredProducts[0].shop_name || "Shop Name",
              shop_image: filteredProducts[0].shop_image || "/placeholder-profile.jpg",
              description: filteredProducts[0].shop_description || "No description available.",
            });
          }
        } else {
          console.error("Data received is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error.response ? error.response.data : error.message);
      }
    };

    fetchProducts();
  }, [shopId]);

  // Filter products based on the selected filters
  const filteredProducts = products.filter((product) => {
    const productPrice = parseFloat(product.price);

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

  // Handle gender and strength checkbox changes
  const handleGenderChange = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter((g) => g !== gender));
    } else {
      setSelectedGenders([...selectedGenders, gender]);
    }
  };

  const handleStrengthChange = (strength: string) => {
    if (selectedStrengths.includes(strength)) {
      setSelectedStrengths(selectedStrengths.filter((s) => s !== strength));
    } else {
      setSelectedStrengths([...selectedStrengths, strength]);
    }
  };

  const handleToneChange = (tone: string) => {
    if (selectedTones.includes(tone)) {
      setSelectedTones(selectedTones.filter((t) => t !== tone));
    } else {
      setSelectedTones([...selectedTones, tone]);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-8">
          <Image
            src={shopDetails.shop_image || "/placeholder-profile.jpg"}
            alt={shopDetails.shop_name}
            width={100}
            height={100}
            className="rounded-full mr-4"
          />
          <div>
            <h1 className="text-3xl font-bold">{shopDetails.shop_name}</h1>
            <p className="text-gray-600 mt-2">{shopDetails.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 flex gap-8 items-start">
          {/* Filter sidebar */}
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
            handleToneChange={handleToneChange}
          />

          {/* Product display */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-3/4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Productcard key={product.product_id} productEach={product} />
              ))
            ) : (
              <p className="text-gray-500">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
