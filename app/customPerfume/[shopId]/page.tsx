"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import axios from "axios";

interface FragranceTone {
  id: number;
  name: string;
}

interface SelectedTone {
  id: number;
  name: string;
  percentage: number;
}

interface Shop {
  shopId: number;
  shopName: string;
  shopImage: string;
}

interface Ingredient {
  ingredient_id: number;
  ingredient_percentage: number;
}

interface CustomPerfume {
  shop_id: number;
  fragrance_name: string;
  description: string | null;
  intensity_level: number;
  volume_ml: number;
  is_tester: string;
  ingredients: Ingredient[];
}

const CustomPerfumePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId"); // ดึง shopId จาก URL

  const [shop, setShop] = useState<Shop | null>(null);
  const [fragranceTones, setFragranceTones] = useState<FragranceTone[]>([]);
  const [selectedTones, setSelectedTones] = useState<SelectedTone[]>([]);
  const [fragranceName, setFragranceName] = useState("");
  const [description, setDescription] = useState("");
  const [intensity, setIntensity] = useState(50);
  const [volume, setVolume] = useState("");
  const [toneSearch, setToneSearch] = useState("");
  const [shopSearch, setShopSearch] = useState("");
  const [isTester, setIsTester] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึง csrf-token และ cart จาก API
        const [csrfResponse] = await Promise.all([
          axios.get(`http://localhost:8000/csrf-token`, { withCredentials: true }),
        ]);

        setCsrfToken(csrfResponse.data.csrf_token);

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

    setFragranceTones([
      { id: 1, name: "Floral" },
      { id: 2, name: "Fruity" },
      { id: 3, name: "Woody" },
      { id: 4, name: "Spicy" },
    ]);
  }, [shopId]);

  const handleToneSelect = (tone: FragranceTone) => {
    setSelectedTones((prev) =>
      prev.some((t) => t.id === tone.id)
        ? prev.filter((t) => t.id !== tone.id)
        : [...prev, { ...tone, percentage: 50 }]
    );
  };

  const handlePercentageChange = (id: number, value: number) => {
    setSelectedTones((prev) =>
      prev.map((t) => (t.id === id ? { ...t, percentage: value } : t))
    );
  };

  const handleSubmit = async () => {
    // ตรวจสอบว่าเลือก tone หรือไม่
    if (selectedTones.length === 0) {
      alert("กรุณาเลือกโทนกลิ่นอย่างน้อย 1 โทน");
      return;
    }
    
    // ตรวจสอบข้อมูลที่กรอกครบหรือไม่
    if (!fragranceName || intensity === 0 || !volume) {
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
      volume_ml: Number(volume),
      is_tester: isTester ? "yes" : "no",
      ingredients: selectedTones.map((tone) => ({
        ingredient_id: tone.id,
        ingredient_percentage: tone.percentage,
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
            // ถ้า Auth ต้องใส่ Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("สั่งสินค้าแล้ว กรุณาตรวจสอบการชำระเงินที่ To Pay");
        router.push("/to-pay");
      } else {
        console.error("❌ Failed:", response);
        alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
      }
    } catch (error: any) {
      console.error("❌ Error submitting order:", error.response?.data || error.message);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };



  const filteredTones = fragranceTones.filter((tone) =>
    tone.name.toLowerCase().includes(toneSearch.toLowerCase())
  );

  const filteredShops = [shop].filter((shop) =>
    shop?.shopName.toLowerCase().includes(shopSearch.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        {/* ปุ่ม Back */}
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

        {/* ค้นหา Tone */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Search Fragrance Tones</label>
          <Input
            value={toneSearch}
            onChange={(e) => setToneSearch(e.target.value)}
            placeholder="Search tones"
            className="w-full"
          />
        </div>

        {/* เลือกโทนกลิ่น */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Select Fragrance Tones</h3>
          <div className="grid grid-cols-2 gap-6">
            {filteredTones.map((tone) => (
              <div key={tone.id} className="flex items-center space-x-3">
                <Checkbox onCheckedChange={() => handleToneSelect(tone)} />
                <span className="text-lg">{tone.name}</span>
                {selectedTones.some((t) => t.id === tone.id) && (
                  <div className="flex items-center space-x-2 w-full">
                    <Slider
                      className="w-full"
                      defaultValue={[50]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(val) => handlePercentageChange(tone.id, val[0])}
                    />
                    <span className="w-12 text-right">{selectedTones.find((t) => t.id === tone.id)?.percentage}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ฟอร์มกรอกข้อมูล */}
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

        {/* ฟิลด์ Volume */}
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

        {/* ปุ่มกด */}
        <div className="flex items-center space-x-6">
          <Checkbox checked={isTester} onCheckedChange={(checked) => setIsTester(checked)} />
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
