"use client";

import { Dispatch, SetStateAction } from "react";

interface FilterComponentProps {
  minPrice: string;
  maxPrice: string;
  searchName: string;
  selectedGenders: string[];
  selectedStrengths: string[];
  setMinPrice: Dispatch<SetStateAction<string>>;
  setMaxPrice: Dispatch<SetStateAction<string>>;
  setSearchName: Dispatch<SetStateAction<string>>;
  handleGenderChange: (gender: string) => void;
  handleStrengthChange: (strength: string) => void;
}

const genderOptions = [
  { label: "ชาย", value: "male" },
  { label: "หญิง", value: "female" },
  { label: "ยูนิเซ็กซ์", value: "unisex" },
];

const strengthOptions = [
  { label: "Extrait de Parfum", value: "extrait de parfum" },
  { label: "Eau de Parfum (EDP)", value: "eau de parfum (edp)" },
  { label: "Eau de Toilette (EDT)", value: "eau de toilette (edt)" },
  { label: "Eau de Cologne (EDC)", value: "eau de cologne (edc)" },
  { label: "Eau Fraiche/mists", value: "eau fraiche/mists" },
];

const FilterSidebar = ({
  minPrice,
  maxPrice,
  searchName,
  selectedGenders,
  selectedStrengths,
  setMinPrice,
  setMaxPrice,
  setSearchName,
  handleGenderChange,
  handleStrengthChange,
}: FilterComponentProps) => {
  return (
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
              onChange={() => handleGenderChange(gender.value)}
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
  );
};

export default FilterSidebar;
