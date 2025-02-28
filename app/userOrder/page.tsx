"use client";
import { useState } from 'react';
import { Search, ShoppingCart, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function UserOrder() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample order data
  const orders = [
    { id: 1, shop: 'Shop1', productName: 'Product Name', description: 'Description', totalPrice: 'Total Price', type: null },
    { id: 2, shop: 'Shop1', productName: 'Product Name', description: 'Description', totalPrice: 'Total Price', type: null },
    { id: 3, shop: 'Shop1', productName: 'Product Name', description: 'Description', totalPrice: 'Total Price', type: 'Custom' },
    { id: 4, shop: 'Shop1', productName: 'Product Name', description: 'Description', totalPrice: 'Total Price', type: 'Custom Tester' },
    { id: 5, shop: 'Shop1', productName: 'Product Name', description: 'Description', totalPrice: 'Total Price', type: null },
    { id: 6, shop: 'Shop1', productName: 'Product Name', description: 'Description', totalPrice: 'Total Price', type: null },
    { id: 7, shop: 'Shop1', productName: 'Product Name', description: 'Description', totalPrice: 'Total Price', type: null },
    { id: 8, shop: 'Shop1', productName: 'Product Name', description: 'Description', totalPrice: 'Total Price', type: null },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4">
        <Navbar />

      {/* Search Bar */}
      <div className="flex justify-between items-center mt-6">
        <div className="relative w-full max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search Product"
            className="w-full px-4 py-2 rounded-full bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
          >
            <Search className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        <div className="flex space-x-6 ml-4">
          <Button variant="ghost" size="sm" className="p-1">
            <ShoppingCart className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1">
            <Bell className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Order Section */}
      <div className="mt-8">
        <h1 className="text-2xl font-bold text-center mb-6">Order</h1>
        
        {/* Search bar specifically for orders */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 rounded-full"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <Search className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>
        
        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                      <Image 
                        src="/profile-placeholder.png"
                        alt="Shop Profile"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium">{order.shop}</span>
                  </div>
                  
                  <div className="flex mt-4">
                    <div className="w-1/3 flex justify-center items-center">
                      <div className="w-24 h-32 bg-gray-100 flex items-center justify-center">
                        <Image 
                          src="/images/product.png"
                          alt="Product"
                          width={60}
                          height={100}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    
                    <div className="w-2/3 pl-4 flex flex-col justify-between">
                      <div>
                        <p className="font-medium">{order.productName}</p>
                        <p className="text-gray-600">{order.description}</p>
                      </div>
                      <p className="text-gray-600">{order.totalPrice}</p>
                      
                      {order.type && (
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 text-xs rounded-md ${
                            order.type === 'Custom Tester' 
                              ? 'bg-yellow-200 text-yellow-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.type}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}