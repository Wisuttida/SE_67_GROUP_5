"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ingredient_id: number;
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

  const [ingredientOptions, setIngredientOptions] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [fragranceName, setFragranceName] = useState("");
  const [description, setDescription] = useState("");
  const [intensity, setIntensity] = useState(50);
  const [volume, setVolume] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [isTester, setIsTester] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึง CSRF Token
        const csrfResponse = await axios.get(`http://localhost:8000/csrf-token`, { withCredentials: true });
        setCsrfToken(csrfResponse.data.csrf_token);

        // ดึงข้อมูลส่วนผสมจาก API
        const ingredientResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`, {
          withCredentials: true,
        });

        if (Array.isArray(ingredientResponse.data.ingredients)) {
          setIngredientOptions(ingredientResponse.data.ingredients);
        } else {
          console.error("ข้อมูลที่ได้รับไม่ใช่ Array:", ingredientResponse.data);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleIngredientSelect = (ingredient: Ingredient) => {
    setSelectedIngredients((prev) =>
      prev.some((i) => i.ingredient_id === ingredient.ingredient_id)
        ? prev.filter((i) => i.ingredient_id !== ingredient.ingredient_id)
        : [...prev, { ...ingredient, percentage: 50 }] // ค่าเริ่มต้น 50%
    );
  };

  const handlePercentageChange = (id: number, value: number) => {
    setSelectedIngredients((prev) =>
      prev.map((i) => (i.ingredient_id === id ? { ...i, percentage: value } : i))
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
        ingredient_id: ing.ingredient_id,
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

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-8">
          Back
        </Button>

        <h2 className="text-2xl font-semibold mb-6">Create Your Custom Fragrance</h2>

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
              <div key={ingredient.ingredient_id} className="flex items-center space-x-3">
                <Checkbox onCheckedChange={() => handleIngredientSelect(ingredient)} />
                <span className="text-lg">{ingredient.name}</span>
                {selectedIngredients.some((i) => i.ingredient_id === ingredient.ingredient_id) && (
                  <div className="flex items-center space-x-2 w-full">
                    <Slider
                      className="w-full"
                      defaultValue={[50]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(val) => handlePercentageChange(ingredient.ingredient_id, val[0])}
                    />
                    <span className="w-12 text-right">{selectedIngredients.find((i) => i.ingredient_id === ingredient.ingredient_id)?.percentage}%</span>
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
