import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredPerfumes = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  return (
    <div className="relative hidden md:flex flex-col w-[500px]" ref={dropdownRef}>
      <div className="flex items-center border rounded-lg px-2 w-full">
        <Search className="text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search perfumes..."
          className="border-none focus:ring-0 flex-1"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(e.target.value.length > 0 && filteredPerfumes.length > 0);
          }}
          onFocus={() => setShowDropdown(filteredPerfumes.length > 0)}
        />
      </div>
      {showDropdown && (
        <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-lg p-2">
          {filteredPerfumes.length > 0 ? (
            <ScrollArea className="max-h-60 overflow-y-auto">
              <ul>
                {filteredPerfumes.slice(0,15).map((product) => (
                  <li
                    key={product.product_id}
                    className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2"
                  >
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} className="w-8 h-8 rounded-md" />
                    )}
                    <Link href={`/product/${product.product_id}`}>
                      <span>{product.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          ) : (
            <p className="text-gray-500 text-sm p-2">No perfumes found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
