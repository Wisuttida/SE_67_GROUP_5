import React from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const ProductdetailPage = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />


      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">

        {/* Product Showcase (รายการสินค้าตัวอย่าง) */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
            <section className="grid grid-cols-2 gap-8">
            
              <img src="/path/to/product1.jpg" alt="Product 1" className="w-full h-48 object-cover rounded-lg" />
              
              <section className="grid grid-rows-2 gap-8">
                <div>

                <h2 className="text-xl font-semibold mt-4">Product 1</h2>
                <p className="text-gray-700 mt-2">$99.99</p>
                </div>
                <Button variant="default" className="mt-4 w-full">Add to Cart</Button>
              </section>
              
            
            </section>
          </div>

      </main>

    </div>
  )
}

export default ProductdetailPage