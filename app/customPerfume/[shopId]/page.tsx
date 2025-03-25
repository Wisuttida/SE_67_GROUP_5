"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // ใช้ดึงค่า shopId จาก URL
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Image from "next/image";

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
  const [toneSearch, setToneSearch] = useState(""); // สำหรับค้นหา tone
  const [shopSearch, setShopSearch] = useState(""); // สำหรับค้นหาร้าน
  const [isTester, setIsTester] = useState(false); // State สำหรับตรวจสอบว่าเลือก Tester หรือไม่

  useEffect(() => {
    // ดึงข้อมูลร้านค้าจากฐานข้อมูล (ตัวอย่าง mock data)
    const dummyShops: Shop[] = Array.from({ length: 14 }, (_, i) => ({
      shopId: i + 1,
      shopName: `Shop${i + 1}`,
      shopImage: "/placeholder-profile.jpg", // เปลี่ยนเป็น URL รูปร้านค้าจริง
    }));

    const foundShop = dummyShops.find((s) => s.shopId.toString() === shopId);
    setShop(foundShop || null);

    // ดึงข้อมูลโทนกลิ่นจากฐานข้อมูล (Mock data)
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

  const handleSubmit = () => {
    console.log("Saving custom fragrance...", {
      fragranceName,
      description,
      intensity,
      volume,
      selectedTones,
    });

    // Mock API Call
    setTimeout(() => {
      alert("สั่งสินค้าแล้ว กรุณาตรวจสอบการชำระเงินที่ To Pay");
      router.push("/to-pay"); // เปลี่ยนเส้นทางไปหน้า "To Pay"
    }, 1000);
  };

  // ฟังก์ชันกรอง tone ตามการค้นหาของผู้ใช้
  const filteredTones = fragranceTones.filter((tone) =>
    tone.name.toLowerCase().includes(toneSearch.toLowerCase())
  );

  // ฟังก์ชันกรองร้านตามการค้นหาของผู้ใช้
  const filteredShops = [shop].filter((shop) =>
    shop?.shopName.toLowerCase().includes(shopSearch.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        {/* ปุ่ม Back */}
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          Back
        </Button>

        {filteredShops.length > 0 && (
          <div className="flex items-center space-x-4 mb-6">
            <Image
              src={filteredShops[0]?.shopImage || "/placeholder-profile.jpg"}
              alt={filteredShops[0]?.shopName || "Shop"}
              width={60}
              height={60}
              className="w-16 h-16 rounded-full"
            />
            <h1 className="text-2xl font-bold">{filteredShops[0]?.shopName}</h1>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Create Your Custom Fragrance</h2>

        {/* ค้นหา Tone */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Search Fragrance Tones</label>
          <Input
            value={toneSearch}
            onChange={(e) => setToneSearch(e.target.value)}
            placeholder="Search tones"
          />
        </div>

        {/* เลือกโทนกลิ่น */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Fragrance Tones</h3>
          <div className="grid grid-cols-2 gap-4">
            {filteredTones.map((tone) => (
              <div key={tone.id} className="flex items-center space-x-3">
                <Checkbox onCheckedChange={() => handleToneSelect(tone)} />
                <span>{tone.name}</span>
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
                    <span className="w-12 text-right">
                      {selectedTones.find((t) => t.id === tone.id)?.percentage}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ฟอร์มกรอกข้อมูล */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Fragrance Name *</label>
          <Input value={fragranceName} onChange={(e) => setFragranceName(e.target.value)} />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Intensity (%) *</label>
          <div className="flex items-center space-x-2">
            <Slider defaultValue={[50]} min={0} max={100} step={1} onValueChange={(val) => setIntensity(val[0])} />
            <span className="w-10 text-right">{intensity}%</span>
          </div>
        </div>

        {/* ฟิลด์ Volume */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Volume (ml) *</label>
          <Input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            disabled={isTester} // ปิดการพิมพ์เมื่อเลือก Tester
          />
        </div>


        {/* ปุ่มกด */}
        <div className="flex space-x-4">
          {/* ปุ่ม Tester */}
          <Checkbox checked={isTester} onCheckedChange={(checked) => setIsTester(checked)} />
          <span>
            Use Tester
          </span>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default CustomPerfumePage;
