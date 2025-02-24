"use client";
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import ProfileShopMenu from '@/components/ProfileShopMenu';

const ProfileShop = () => {
    return (
        <div>
          <Navbar />
          <div className="p-6 bg-gray-100 min-h-screen">
            <ProfileShopMenu />
            {/* Shop Address Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
              <h3 className="text-lg font-semibold">Shop Address</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {[
                  "ชื่อ",
                  "นามสกุล",
                  "หมายเลขโทรศัพท์",
                  "บ้านเลขที่",
                  "ตำบล",
                  "อำเภอ",
                  "จังหวัด",
                  "รหัสไปรสณีย์",
                  
                ].map((field, index) => (
                  <div key={index} className="border-b pb-1"> {field} </div>
                ))}
              </div>
              <Link href="/shopEditAddress" className="text-blue-500 mt-3 inline-block">✏️ Edit Address</Link>
              
            
            </div>

            {/* Description Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <textarea className="w-full p-2 border rounded-lg mt-2" placeholder="Text"></textarea>
            </div>
          </div>
        </div>
    );
};

export default ProfileShop;