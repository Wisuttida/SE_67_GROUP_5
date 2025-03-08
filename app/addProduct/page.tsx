"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ProfileShopMenu from '@/components/SideBarShop';
import { useRouter } from 'next/navigation';

const AddProduct = () => {
    const router = useRouter();

    const [product, setProduct] = useState({
        productName: '',
        price: 0,
        stock: 0,
        quantity: 1,
        fragrance: '',
        strengths: '',
        volume: 0,
        gender: '',
        description: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? Math.max(0, value) : value;
        setProduct((prev) => ({ ...prev, [name]: parsedValue }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Product Added:', product);
        router.push('/myProductShop');
    };

    return (
        <div>
            <Navbar />
            <div className="p-6 bg-gray-100 min-h-screen">
                <ProfileShopMenu />
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md flex">
                    <div className="flex flex-col items-center p-4">
                        <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-4 relative">
                            {product.image ? (
                                <>
                                    <img src={product.image} alt="Product" className="w-full h-full object-cover rounded-lg" />
                                    <label className="absolute bottom-2 right-2 bg-black text-white p-1 rounded cursor-pointer">
                                        Change Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </>
                            ) : (
                                <label className="text-blue-500 cursor-pointer">
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    Upload Image
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        {[{ name: 'productName', label: 'ชื่อสินค้า', type: 'text' },
                        { name: 'price', label: 'ราคา', type: 'number', min: 0 },
                        { name: 'stock', label: 'จำนวนในคลัง', type: 'number', min: 0 },
                        { name: 'quantity', label: 'ขั้นต่ำในการสั่งซื้อ', type: 'number', min: 1 }].map(({ name, label, type, min }) => (
                            <div key={name}>
                                <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={product[name]}
                                    onChange={handleChange}
                                    placeholder={label}
                                    min={min}
                                    className="p-2 border rounded-lg w-full"
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">ความเข้มข้นของน้ำหอม</label>
                            <select
                                name="strengths"
                                value={product.strengths}
                                onChange={handleChange}
                                className="p-2 border rounded-lg w-full"
                            >
                                <option value="">เลือกความเข้มข้น</option>
                                <option value="Light">Light</option>
                                <option value="Medium">Medium</option>
                                <option value="Strong">Strong</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">เพศ</label>
                            <select
                                name="gender"
                                value={product.gender}
                                onChange={handleChange}
                                className="p-2 border rounded-lg w-full"
                            >
                                <option value="">เลือกเพศ</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">กลิ่น</label>
                            <select
                                name="fragrance"
                                value={product.fragrance}
                                onChange={handleChange}
                                className="p-2 border rounded-lg w-full"
                            >
                                <option value="">เลือกกลิ่น</option>
                                <option value="Floral">Floral</option>
                                <option value="Fruity">Fruity</option>
                                <option value="Woody">Woody</option>
                                <option value="Citrus">Citrus</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">ปริมาณ</label>
                            <input
                                type="number"
                                name="volume"
                                value={product.volume}
                                onChange={handleChange}
                                placeholder="ปริมาณ"
                                min={0}
                                className="p-2 border rounded-lg w-full"
                            />
                        </div>

                        <div className="col-span-2 bg-white p-4 rounded-lg shadow-md mt-4">
                            <h3 className="text-lg font-semibold">คำอธิบาย</h3>
                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg mt-2"
                                placeholder="Text"
                                rows={5}
                            />
                        </div>

                        <Button onClick={handleSubmit} className="col-span-2 bg-black text-white">
                            Add to Shop
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
