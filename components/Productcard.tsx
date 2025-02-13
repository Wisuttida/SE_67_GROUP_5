import { Button } from "@/components/ui/button";
import Link from "next/link";

const Productcard = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
        <Link href="/productdetail" passHref>
        <img src="/path/to/product1.jpg" alt="Product 1" className="w-full h-48 object-cover rounded-lg" />
        <h2 className="text-xl font-semibold mt-4">Product 1</h2>
        <p className="text-gray-700 mt-2">$99.99</p>
        </Link>
        <Button variant="default" className="mt-4 w-full">Add to Cart</Button>
    </div>
  )
}

export default Productcard