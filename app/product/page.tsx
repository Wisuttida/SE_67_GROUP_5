"use client";

import Navbar from "@/components/Navbar";
import Productcard from "@/components/Productcard";
import { testDatabase } from "@/components/testDatabase";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const ProductPage = () => {
  const products = testDatabase;

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 flex gap-8">
        {/* Sidebar Filter */}
        <aside className="w-1/4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-4">Filter by Price</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="price-100" />
                  <Label htmlFor="price-100">$100+</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="price-150" />
                  <Label htmlFor="price-150">$150+</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="price-200" />
                  <Label htmlFor="price-200">$200+</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Product Showcase */}
        <section className="grid grid-cols-3 gap-8 w-3/4">
          {products.map((product) => (
            <Productcard key={product.productId} product={product} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProductPage;
