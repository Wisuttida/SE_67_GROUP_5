"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Ingredient {
  id: number;
  name: string;
  percentage?: number; // ใช้ optional field สำหรับกรณี selected ingredients
}

interface Shop {
  shopId: number;
  shopName: string;
  shopImage: string;
}

interface CustomPerfume {
  shop_id: number;
  fragrance_name: string;
  description: string | null;
  intensity_level: number;
  volume_ml: number;
  is_tester: string;
  ingredients: { ingredient_id: number; ingredient_percentage: number }[];
}

const CustomPerfumePage = () => {
  const router = useRouter();
  const params = useParams();
  const shopId = params?.shopId;

  const [shop, setShop] = useState<Shop | null>(null);
  const [ingredientOptions, setIngredientOptions] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [fragranceName, setFragranceName] = useState("");
  const [description, setDescription] = useState("");
  const [intensity, setIntensity] = useState(50);
  const [volume, setVolume] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [shopSearch, setShopSearch] = useState("");
  const [isTester, setIsTester] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [csrfResponse] = await Promise.all([
          axios.get(`http://localhost:8000/csrf-token`, { withCredentials: true }),
        ]);

        setCsrfToken(csrfResponse.data.csrf_token);

        const addressFromStorage = localStorage.getItem('addresses');
        if (addressFromStorage) {
          const addressData = JSON.parse(addressFromStorage);
          const positionFourAddresses = addressData.filter((addr: any) => addr.position_id === 4);
          const sortedAddresses = positionFourAddresses.sort(
            (a: any, b: any) => b.is_default - a.is_default
          );
          setAddresses(sortedAddresses);

          if (sortedAddresses.length > 0) {
            setSelectedAddress(sortedAddresses[0].address_id.toString());
          }
          console.log("✅ Address from localStorage:", sortedAddresses);
        } else {
          console.warn("⚠️ No address data found in localStorage");
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const dummyShops: Shop[] = Array.from({ length: 14 }, (_, i) => ({
      shopId: i + 1,
      shopName: `Shop${i + 1}`,
      shopImage: "/placeholder-profile.jpg",
    }));

    const foundShop = dummyShops.find((s) => s.shopId.toString() === shopId);
    setShop(foundShop || null);

    // Mock Ingredient options
    setIngredientOptions([
      { id: 1, name: "กุหลาบ" },
      { id: 2, name: "มะลิ" },
      { id: 3, name: "ลาเวนเดอร์" },
      { id: 4, name: "กระดังงา" },
    ]);
  }, [shopId]);

  const handleIngredientSelect = (ingredient: Ingredient) => {
    setSelectedIngredients((prev) =>
      prev.some((i) => i.id === ingredient.id)
        ? prev.filter((i) => i.id !== ingredient.id)
        : [...prev, { ...ingredient, percentage: 50 }] // ค่าเริ่มต้น 50%
    );
  };

  const handlePercentageChange = (id: number, value: number) => {
    setSelectedIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, percentage: value } : i))
    );
  };

  const handleSubmit = async () => {
    if (selectedIngredients.length === 0) {
      alert("กรุณาเลือกส่วนผสมอย่างน้อย 1 รายการ");
      return;
    }

    if (!fragranceName || intensity === 0 || (!volume && !isTester)) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อกลิ่น, ความเข้มข้น, ปริมาตร)");
      return;
    }

    if (!shopId) {
      alert("ไม่พบร้านค้า");
      return;
    }

    const payload: CustomPerfume = {
      shop_id: Number(shopId),
      fragrance_name: fragranceName,
      description: description || null,
      intensity_level: intensity,
      volume_ml: isTester ? 1 : Number(volume),
      is_tester: isTester ? "yes" : "no",
      ingredients: selectedIngredients.map((ing) => ({
        ingredient_id: ing.id,
        ingredient_percentage: ing.percentage ?? 0, // ป้องกัน undefined
      })),
    };

    console.log("📦 Payload =>", payload);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/custom-orders`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("สั่งสินค้าแล้ว กรุณาตรวจสอบการชำระเงินที่ To Pay");
        router.push("/to-pay");
      } else {
        console.error("❌ Failed:", response);
        alert(response);
      }
    } catch (error: any) {
      console.error("❌ Error submitting order:", error.response?.data || error.message);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const filteredIngredients = ingredientOptions.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  const filteredShops = [shop].filter((shop) =>
    shop?.shopName.toLowerCase().includes(shopSearch.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-8">
          Back
        </Button>

        {filteredShops.length > 0 && (
          <div className="flex items-center space-x-4 mb-8">
            <Image
              src={filteredShops[0]?.shopImage || "/placeholder-profile.jpg"}
              alt={filteredShops[0]?.shopName || "Shop"}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full"
            />
            <h1 className="text-3xl font-bold">{filteredShops[0]?.shopName}</h1>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-6">Create Your Custom Fragrance</h2>

        <div className="flex items-center space-x-4 mb-4">
          <label className="font-semibold">เลือกที่อยู่จัดส่ง:</label>
          <Select value={selectedAddress} onValueChange={setSelectedAddress}>
            <SelectTrigger className="w-full max-w-[1000px]">
              <SelectValue placeholder="เลือกที่อยู่" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((addr) => (
                <SelectItem key={addr.address_id} value={addr.address_id.toString()} className="text-left">
                  {`${addr.fname} ${addr.lname} 
                  | ${addr.house_number} ${addr.building} ${addr.street_name} ต.${addr.subDistrict} อ.${addr.district} จ.${addr.province} ${addr.zipcode} 
                  | โทร ${addr.phonenumber}`}
                  {addr.is_default === 1 ? ' (ค่าเริ่มต้น)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Search Ingredients</label>
          <Input
            value={ingredientSearch}
            onChange={(e) => setIngredientSearch(e.target.value)}
            placeholder="Search ingredients"
            className="w-full"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Select Ingredients *</h3>
          <div className="grid grid-cols-2 gap-6">
            {filteredIngredients.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center space-x-3">
                <Checkbox onCheckedChange={() => handleIngredientSelect(ingredient)} />
                <span className="text-lg">{ingredient.name}</span>
                {selectedIngredients.some((i) => i.id === ingredient.id) && (
                  <div className="flex items-center space-x-2 w-full">
                    <Slider
                      className="w-full"
                      defaultValue={[50]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(val) => handlePercentageChange(ingredient.id, val[0])}
                    />
                    <span className="w-12 text-right">{selectedIngredients.find((i) => i.id === ingredient.id)?.percentage}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">Fragrance Name *</label>
          <Input
            value={fragranceName}
            onChange={(e) => setFragranceName(e.target.value)}
            placeholder="Enter fragrance name"
            className="w-full"
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your fragrance"
            className="w-full"
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">Intensity (%) *</label>
          <div className="flex items-center space-x-2">
            <Slider
              defaultValue={[50]}
              min={0}
              max={100}
              step={1}
              onValueChange={(val) => setIntensity(val[0])}
              className="w-full"
            />
            <span className="w-12 text-right">{intensity}%</span>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">Volume (ml) *</label>
          <Input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            disabled={isTester}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-6">
          <Checkbox checked={isTester} onCheckedChange={(checked) => setIsTester(!!checked)} />
          <span className="text-lg">Use Tester</span>
          <Button onClick={handleSubmit} className="ml-4 py-3 px-6 text-lg font-semibold">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomPerfumePage;
