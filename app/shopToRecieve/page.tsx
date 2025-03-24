"use client";

import Navbar from '@/components/Navbar';
import SideBarShop from '@/components/SideBarShop';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface Product {
    product_id: string;
    name: string;
    description: string;
    amount: number;
    unit: string;
    total_amount: number;
    isReceived: boolean;
    farm: {
        farm_name: string;
        farm_image: string;
    };
}

const ShopToRecieve = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    // Sample product data
    const [products, setProducts] = useState<Product[]>([
        {
            product_id: '1',
            name: 'ชื่อวัตถุดิบ',
            description: 'รายละเอียด',
            amount: 1,
            unit:"Kg",
            total_amount: 499,
            isReceived: false,
            farm: {
                farm_name: 'Farm1',
                farm_image: '/profile-placeholder.png'
            }
        },
        
    ]);

    // Handle marking product as received
    const handleMarkAsReceived = async (productId: string) => {
        setIsLoading(true);
        try {
            setProducts(prev => prev.map(product => 
                product.product_id === productId 
                    ? { ...product, isReceived: true }
                    : product
            ));
            
            toast("ยืนยันการรับสินค้าเรียบร้อยแล้ว");
        } catch (error) {
            console.error("Error confirming received product:", error);
            toast("เกิดข้อผิดพลาดในการยืนยันการรับสินค้า");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="flex">
                <div className="w-64 bg-gray-300 text-white p-6">
                    <SideBarShop />
                </div>
                <div className="container mx-auto p-6">
                    <h1 className="text-2xl font-bold text-center mb-6">รายการที่ต้องได้รับ</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
            ไม่มีรายการที่ต้องได้รับ
        </div>
    ) : (
        products.map((product) => (
            <Card key={product.product_id} className="overflow-hidden shadow-lg rounded-lg p-4">
                <CardContent className="flex flex-col gap-4">
                    
                    {/* ฟาร์ม & สถานะ */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                <Image 
                                    src={product.farm.farm_image}
                                    alt={product.farm.farm_name}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-medium text-lg">{product.farm.farm_name}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                            product.isReceived 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {product.isReceived ? 'ได้รับแล้ว' : 'รอรับสินค้า'}
                        </span>
                    </div>

                    {/* รายละเอียดสินค้า */}
                    <div>
                        <h3 className="font-semibold text-xl">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                        <p className="text-sm text-gray-600">จำนวน: {product.amount} {product.unit}</p>
                        <p className="text-sm text-gray-600 mb-3">ราคารวม: ฿{product.total_amount.toLocaleString()}</p>
                    </div>

                    {/* ปุ่มยืนยันรับสินค้า */}
                    {!product.isReceived && (
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                            onClick={() => handleMarkAsReceived(product.product_id)}
                            disabled={isLoading}
                        >
                            {isLoading ? 'กำลังดำเนินการ...' : 'ยืนยันการรับสินค้า'}
                        </Button>
                    )}
                </CardContent>
            </Card>
        ))
    )}
</div>


                </div>
            </div>
        </div>
    );
};
export default ShopToRecieve;