"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ProfileShopMenu from '@/components/ProfileShopMenu';

const AddProduct = () => {
    const [product, setProduct] = useState({
        productName: '',
        price: '',
        stock: '',
        quantity: '',
        fragrance: '',
        strengths: '',
        volume: '',
        gender: '',
        description: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = () => {
        console.log('Product Added:', product);
    };

    const inputFields = [
        { name: 'productName', label: 'ชื่อสินค้า' },
        { name: 'price', label: 'ราคา' },
        { name: 'stock', label: 'จำนวนในคลัง' },
        { name: 'quantity', label: 'ขั้นต่ำในการสั่งซื้อ' },
        { name: 'fragrance', label: 'กลิ่น' },
        { name: 'strengths', label: 'ความเข้มข้น' },
        { name: 'volume', label: 'ปริมาณ' },
        { name: 'gender', label: 'เพศ' },
    ];

    return (
        <div>
            <Navbar />
            <div className="p-6 bg-gray-100 min-h-screen">
                <ProfileShopMenu />
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md flex">
                    <div className="flex flex-col items-center p-4">
                        <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                            {product.image ? (
                                <img src={product.image} alt="Product" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <label className="text-blue-500 cursor-pointer">
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    Upload Image
                                </label>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        {inputFields.map(({ name, label }) => (
                            <div key={name}>
                                <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
                                <input
                                    type="text"
                                    name={name}
                                    value={product[name]}
                                    onChange={handleChange}
                                    placeholder={label}
                                    className="p-2 border rounded-lg w-full"
                                />
                            </div>
                        ))}
                        <Button onClick={handleSubmit} className="col-span-2 bg-black text-white">
                            Add to Shop
                        </Button>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                    <h3 className="text-lg font-semibold">Description</h3>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg mt-2"
                        placeholder="Text"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
