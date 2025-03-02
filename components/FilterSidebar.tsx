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
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters([...selectedFilters, value]);
    } else {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Price Ranges */}
        <div>
          <h2 className="text-lg font-bold mb-2">Price Range</h2>
          {["500", "1000", "2000", "5000"].map((price) => (
            <div key={price} className="flex items-center gap-2">
              <Checkbox 
                id={`price-${price}`}
                checked={selectedFilters.includes(price)}
                onCheckedChange={(checked) => handleCheckboxChange(price, checked as boolean)}
              />
              <Label htmlFor={`price-${price}`}>{`฿${price} and above`}</Label>
            </div>
          ))}
        </div>

        {/* Other filters can be added here when the API supports them */}
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
