import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Product {
  productId: number;
  name: string;
  price: number;
}

const Productcard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
        <Link href={`/product/${product.productId}`} passHref>
        <img src="/path/to/product1.jpg" alt="Product 1" className="w-full h-48 object-cover rounded-lg" />
        <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
        <p className="text-gray-700 mt-2">${product.price.toFixed(2)}</p>
        </Link>
        <Button variant="default" className="mt-4 w-full">Add to Cart</Button>
    </div>
  )
}

export default Productcard