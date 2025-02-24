"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ProfileShopMenu from '@/components/ProfileShopMenu';

const ShopToShip = () => {
  const orders = [
    { id: 1, shopName: 'User1', productName: 'Product Name', amount: 'Amount', totalPrice: 'Total Price' },
    { id: 2, shopName: 'User2', productName: 'Product Name', amount: 'Amount', totalPrice: 'Total Price' },
    { id: 3, shopName: 'User3', productName: 'Product Name', amount: 'Amount', totalPrice: 'Total Price' },
    { id: 4, shopName: 'User4', productName: 'Product Name', amount: 'Amount', totalPrice: 'Total Price' },
    { id: 5, shopName: 'User5', productName: 'Product Name', amount: 'Amount', totalPrice: 'Total Price' },
  ];

  return (
    <div>
        <Navbar />
        <ProfileShopMenu />
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-semibold mb-4 text-center">To Ship</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                        <div className="flex items-center mb-4">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                alt="Shop"
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{order.shopName}</h3>
                                <p className="text-sm">{order.productName}</p>
                                <p className="text-sm">{order.amount}</p>
                                <p className="text-sm">{order.totalPrice}</p>
                            </div>
                        </div>
                        <Button className="bg-green-500 text-white">Finish</Button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ShopToShip;
