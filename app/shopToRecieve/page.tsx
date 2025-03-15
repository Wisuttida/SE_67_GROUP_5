"use client";

import Navbar from '@/components/Navbar';
import SideBarShop from '@/components/SideBarShop';

const ShopToRecieve = () => {
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* เริ่มต้น Flexbox Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-300 text-white p-6">
          <SideBarShop />
        </div>

        
      </div>
    </div>
  );
};

export default ShopToRecieve;
