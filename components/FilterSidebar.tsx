import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterSidebarProps {
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
}

const FilterSidebar = ({ selectedFilters, setSelectedFilters }: FilterSidebarProps) => {
  const [showMoreAge, setShowMoreAge] = useState(false);
  const [showMoreFragrance, setShowMoreFragrance] = useState(false);
  const [showMoreStrength, setShowMoreStrength] = useState(false);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters([...selectedFilters, value]); // เพิ่ม filter
    } else {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== value)); // เอาออกจาก filter
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Gender */}
        <div>
          <h2 className="text-lg font-bold mb-2">Gender</h2>
          {["Female", "Male", "Unisex"].map((gender) => (
            <div key={gender} className="flex items-center gap-2">
              <Checkbox 
                id={gender} 
                checked={selectedFilters.includes(gender)}
                onCheckedChange={(checked) => handleCheckboxChange(gender, checked as boolean)}
              />
              <Label htmlFor={gender}>{gender}</Label>
            </div>
          ))}
        </div>

        {/* Age */}
        <div>
          <h2 className="text-lg font-bold mb-2">Age</h2>
          {["Under 18", "18-24", "25-34"].map((age) => (
            <div key={age} className="flex items-center gap-2">
              <Checkbox 
                id={age} 
                checked={selectedFilters.includes(age)}
                onCheckedChange={(checked) => handleCheckboxChange(age, checked as boolean)}
              />
              <Label htmlFor={age}>{age}</Label>
            </div>
          ))}
          {showMoreAge ? (
            <>
              {["35-44", "45-54", "55+"].map((age) => (
                <div key={age} className="flex items-center gap-2">
                  <Checkbox 
                    id={age} 
                    checked={selectedFilters.includes(age)}
                    onCheckedChange={(checked) => handleCheckboxChange(age, checked as boolean)}
                  />
                  <Label htmlFor={age}>{age}</Label>
                </div>
              ))}
              <button 
                className="text-blue-600 text-sm flex items-center"
                onClick={() => setShowMoreAge(false)}
              >
                <ChevronUp size={16} className="mr-1" /> See less
              </button>
            </>
          ) : (
            <button 
              className="text-blue-600 text-sm flex items-center"
              onClick={() => setShowMoreAge(true)}
            >
              <ChevronDown size={16} className="mr-1" /> See more
            </button>
          )}
        </div>

        {/* Fragrance Tone */}
        <div>
          <h2 className="text-lg font-bold mb-2">Fragrance Tone</h2>
          {["Floral", "Fruity", "Spicy"].map((tone) => (
            <div key={tone} className="flex items-center gap-2">
              <Checkbox 
                id={tone} 
                checked={selectedFilters.includes(tone)}
                onCheckedChange={(checked) => handleCheckboxChange(tone, checked as boolean)}
              />
              <Label htmlFor={tone}>{tone}</Label>
            </div>
          ))}
          {showMoreFragrance && (
            <>
              {["Woody", "Citrus", "Fresh", "Oriental"].map((tone) => (
                <div key={tone} className="flex items-center gap-2">
                  <Checkbox 
                    id={tone} 
                    checked={selectedFilters.includes(tone)}
                    onCheckedChange={(checked) => handleCheckboxChange(tone, checked as boolean)}
                  />
                  <Label htmlFor={tone}>{tone}</Label>
                </div>
              ))}
              <button 
                className="text-blue-600 text-sm flex items-center"
                onClick={() => setShowMoreFragrance(false)}
              >
                <ChevronUp size={16} className="mr-1" /> See less
              </button>
            </>
          )}
          {!showMoreFragrance && (
            <button 
              className="text-blue-600 text-sm flex items-center"
              onClick={() => setShowMoreFragrance(true)}
            >
              <ChevronDown size={16} className="mr-1" /> See more
            </button>
          )}
        </div>

        {/* Fragrance Strength */}
        <div>
          <h2 className="text-lg font-bold mb-2">Fragrance Strength</h2>
          {[
            "Extrait de Parfum",
            "Eau de Parfum (EDP)",
            "Eau de Toilette (EDT)",
            "Eau de Cologne (EDC)",
            "Eau Fraiche/mists",
          ].map((strength) => (
            <div key={strength} className="flex items-center gap-2">
              <Checkbox 
                id={strength} 
                checked={selectedFilters.includes(strength)}
                onCheckedChange={(checked) => handleCheckboxChange(strength, checked as boolean)}
              />
              <Label htmlFor={strength}>{strength}</Label>
            </div>
          ))}
          {showMoreStrength && (
            <>
              {["Body Mist", "Aftershave", "Solid Perfume"].map((strength) => (
                <div key={strength} className="flex items-center gap-2">
                  <Checkbox 
                    id={strength} 
                    checked={selectedFilters.includes(strength)}
                    onCheckedChange={(checked) => handleCheckboxChange(strength, checked as boolean)}
                  />
                  <Label htmlFor={strength}>{strength}</Label>
                </div>
              ))}
              <button 
                className="text-blue-600 text-sm flex items-center"
                onClick={() => setShowMoreStrength(false)}
              >
                <ChevronUp size={16} className="mr-1" /> See less
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
