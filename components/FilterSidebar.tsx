import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface FilterSidebarProps {
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
}

const FilterSidebar = ({ selectedFilters, setSelectedFilters }: FilterSidebarProps) => {
  const handleCheckboxChange = (value: string) => {
    if (selectedFilters.includes(value)) {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
    } else {
      setSelectedFilters([...selectedFilters, value]);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-4">Filter by Price</h2>
        <div className="space-y-2">
          {["100", "150", "200"].map((price) => (
            <div key={price} className="flex items-center gap-2">
              <Checkbox 
                id={`price-${price}`} 
                checked={selectedFilters.includes(price)}
                onCheckedChange={() => handleCheckboxChange(price)}
              />
              <Label htmlFor={`price-${price}`}>${price}+</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
