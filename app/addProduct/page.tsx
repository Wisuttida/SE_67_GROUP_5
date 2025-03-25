"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import SideBarShop from '@/components/SideBarShop';
import axios from 'axios';

const AddProduct = () => {
    const router = useRouter();

    const [product, setProduct] = useState({
        name: '',
        price: 0,
        stock_quantity: 0,
        quantity: 1,
        fragrance_tone_name: '',
        fragrance_strength: '',
        volume: 0,
        gender_target: '',
        description: '',
        image_url: null,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? Math.max(0, value) : value;
        setProduct((prev) => ({ ...prev, [name]: parsedValue }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct((prev) => ({ ...prev, image_url: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!product.name || !product.price || !product.stock_quantity || !product.quantity || !product.fragrance_tone_name || !product.fragrance_strength || !product.volume || !product.gender_target || !product.description || !product.image_url) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        // ตรวจสอบข้อมูลที่เก็บใน state
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('price', product.price.toString());
        formData.append('stock_quantity', product.stock_quantity.toString());
        formData.append('quantity', product.quantity.toString());
        formData.append('fragrance_tone_name', product.fragrance_tone_name);
        formData.append('fragrance_strength', product.fragrance_strength);
        formData.append('volume', product.volume.toString());
        formData.append('gender_target', product.gender_target);
        formData.append('description', product.description);

        // ถ้ามีการเลือกไฟล์รูปภาพ
        // if (product.image_url) {
        //     const imageFile = product.image_url.split(',')[1]; // ตัด URL ของรูปภาพที่เก็บใน state
        //     const fileBlob = new Blob([new Uint8Array(atob(imageFile).split('').map(c => c.charCodeAt(0)))], { type: 'image/jpeg' });
        //     formData.append('image', fileBlob, 'product-image.jpg');
        // }

    //     try {
    //         // ส่งข้อมูลไปยัง backend
    //         const response = await axios.post(
    //             `${process.env.NEXT_PUBLIC_API_URL}/products`,  // ปรับ URL API ของคุณให้ตรง
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',  // กำหนด Content-Type สำหรับการส่งไฟล์
    //                 },
    //                 withCredentials: true,  // ส่งคุกกี้สำหรับการยืนยัน
    //             }
    //         );

    //         // ถ้าส่งข้อมูลสำเร็จ
    //         alert("✅ เพิ่มสินค้าในร้านสำเร็จ!");
    //         router.push("/myProductShop"); // ไปยังหน้าที่แสดงสินค้าของร้าน
    //     } catch (error) {
    //         console.error("Error adding product:", error);
    //         alert("❌ ไม่สามารถเพิ่มสินค้า: " + (error.response?.data?.error || error.message));
    //     }
    router.push('myProductShop');
    };

    return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="flex">
                    {/* Sidebar */}
                    <SideBarShop/>
                    
                    {/* Main content area */}
                    <div className="flex-1 p-5 bg-gray-100">
                        
                        <div className="mt-6 bg-white p-6 rounded-lg shadow-md flex">
                            <div className="flex flex-col items-center p-4">
                                <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-4 relative">
                                    {product.image_url ? (
                                        <>
                                            <img src={product.image_url} alt="Product" className="w-full h-full object-cover rounded-lg" />
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
                                {[{ name: 'name', label: 'ชื่อสินค้า', type: 'text' },
                                { name: 'price', label: 'ราคา', type: 'number', min: 0 },
                                { name: 'stock_quantity', label: 'จำนวนในคลัง', type: 'number', min: 0 },
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
                                        name="fragrance_strength"
                                        value={product.fragrance_strength}
                                        onChange={handleChange}
                                        className="p-2 border rounded-lg w-full"
                                    >
                                        <option value="">เลือกความเข้มข้น</option>
                                        <option value="Light">25%</option>
                                        <option value="Medium">50%</option>
                                        <option value="Strong">100%</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">เพศ</label>
                                    <select
                                        name="gender_target"
                                        value={product.gender_target}
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
                                        name="fragrance_tone_name"
                                        value={product.fragrance_tone_name}
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
        </div>
    );
};

export default AddProduct;
