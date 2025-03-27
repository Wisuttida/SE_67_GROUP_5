"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import SideBarShop from "@/components/SideBarShop";
import axios from "axios";
import { uploadImage } from '@/pages/api/upload';

import { ImageKitProvider, IKImage, IKUpload } from "imagekitio-next";
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth");
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};
const fragranceTones = [
  { id: 1, name: "Floral" },
  { id: 2, name: "Fruity" },
  { id: 3, name: "Spicy" },
  { id: 4, name: "Woody" },
  { id: 5, name: "Fresh" },
  { id: 6, name: "Oriental" },
  { id: 7, name: "Herbal" },
  { id: 8, name: "Gourmand" },
];
interface Product {
    name: string;
    price: number;
    stock_quantity: number;
    fragrance_tone_ids: number[]; // Array of integers
    fragrance_strength: string;
    volume: number;
    gender_target: string;
    description: string;
    image_url: string;
    status: string;
}

const AddProduct = () => {
    const csrf = localStorage.getItem("csrfToken");
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [image_url, setImageUrl] = useState<String>('');
    const [temp_image_url, setTempImageUrl] = useState<string>('');
    const onError = (err) => {
        console.log("Error", err);
      };
    const onSuccess = (res) => {
        console.log("Success", res);
        setImageUrl(res.url);
    };
    const [product, setProduct] = useState<Product>({
        name: "",
        price: 0,
        stock_quantity: 0,
        fragrance_tone_ids: [],
        fragrance_strength: "",
        volume: 0,
        gender_target: "",
        description: "",
        image_url: "",
        status: "active", // Default status
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setProduct({
            ...product,
            [name]: type === "number" || name === "price" || name === "stock_quantity" || name === "volume"
                ? parseFloat(value) || 0
                : value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setTempImageUrl(imageUrl);
        }
    };

    const handleFragranceToneChange = (e: React.ChangeEvent<HTMLInputElement>, toneId: number) => {
        const isChecked = e.target.checked;
        let updatedTones = [...product.fragrance_tone_ids];

        if (isChecked) {
            updatedTones.push(toneId);
        } else {
            updatedTones = updatedTones.filter(id => id !== toneId);
        }

        setProduct({
            ...product,
            fragrance_tone_ids: updatedTones,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            // Format the payload to match backend requirements
            const formData = {
                ...product,
                ...{ image_url: image_url }, // Include image_url only if it's valid
            };

            console.log("Payload being sent:", formData);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/products`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrf,
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            console.log("Response:", response.data);
            alert("Product created successfully!");
            router.push("/product");

            // Reset the form
            setProduct({
                name: "",
                price: 0,
                stock_quantity: 0,
                fragrance_tone_ids: [],
                fragrance_strength: "",
                volume: 0,
                gender_target: "",
                description: "",
                image_url: "",
                status: "active",
            });
            setSelectedFile(null);

        } catch (error: any) {
            console.error("❌ Error:", error);
            setErrorMessage(
                error.response?.data?.message || error.message || "Failed to create product. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (image_url) {
            return; // Set loading to false when addressInfo is available
        }
    }, [image_url]);
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex">
                <SideBarShop />
                <div className="flex-1 p-5 bg-gray-100">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="mb-4">
                                <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-700">อัปโหลดรูปภาพ</label>
                                {temp_image_url.length > 0 && 
                                    <div className="border rounded-lg overflow-hidden bg-gray-200 mb-4" style={{ width: '300px', height: '300px' }}>
                                        <img 
                                            src={temp_image_url} 
                                            alt="Product Image" 
                                            className="object-cover"
                                            style={{ width: '300px', height: '300px' }}
                                        />
                                    </div>
                                }
                                <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
                                    <div>
                                        <h2>File upload</h2>
                                            <IKUpload fileName="test-upload.png" onError={onError} onSuccess={onSuccess} onChange={handleImageChange} className="file:py-2 file:px-4 file:border file:border-blue-600 file:rounded-md p-2 border rounded-lg w-full"/>
                                    </div>
                                </ImageKitProvider>
                            </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">ชื่อสินค้า</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={product.name}
                                    onChange={handleChange}
                                    required
                                    className="p-2 border rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="price" className="block mb-1 text-sm font-medium text-gray-700">ราคา</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="text" // เปลี่ยนเป็น type="text"
                                    value={product.price}
                                    onChange={handleChange}
                                    required
                                    className="p-2 border rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="stock_quantity" className="block mb-1 text-sm font-medium text-gray-700">จำนวนในคลัง</label>
                                <input
                                    id="stock_quantity"
                                    name="stock_quantity"
                                    type="text" // เปลี่ยนเป็น type="text"
                                    value={product.stock_quantity}
                                    onChange={handleChange}
                                    required
                                    className="p-2 border rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="volume" className="block mb-1 text-sm font-medium text-gray-700">ปริมาณ</label>
                                <input
                                    id="volume"
                                    name="volume"
                                    type="text" // เปลี่ยนเป็น type="text"
                                    value={product.volume}
                                    onChange={handleChange}
                                    required
                                    className="p-2 border rounded-lg w-full"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">คำอธิบาย</label>
                            <textarea
                                id="description"
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                className="p-2 border rounded-lg w-full"
                                rows={4}
                            />
                        </div>

                        <div className="mt-4">
                            <label htmlFor="gender_target" className="block mb-1 text-sm font-medium text-gray-700">เพศ</label>
                            <select
                                id="gender_target"
                                name="gender_target"
                                value={product.gender_target}
                                onChange={handleChange}
                                required
                                className="p-2 border rounded-lg w-full"
                            >
                                <option value="">สำหรับเพศ</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="fragrance_strength" className="block mb-1 text-sm font-medium text-gray-700">ความเข้มข้นของน้ำหอม</label>
                            <select
                                id="fragrance_strength"
                                name="fragrance_strength"
                                value={product.fragrance_strength}
                                onChange={handleChange}
                                required
                                className="p-2 border rounded-lg w-full"
                            >
                                <option value="">เลือกความเข้มข้น</option>
                                <option value="Extrait de Parfum">Extrait de Parfum</option>
                                <option value="Eau de Parfum (EDP)">Eau de Parfum (EDP)</option>
                                <option value="Eau de Toilette (EDT)">Eau de Toilette (EDT)</option>
                                <option value="Eau de Cologne (EDC)">Eau de Cologne (EDC)</option>
                                <option value="Mist">Mist</option>
                            </select>
                        </div>

                        <div className="mt-4">
                            <label className="block mb-1 text-sm font-medium text-gray-700">เลือก Tone น้ำหอม</label>
                            <div className="space-y-2 grid grid-cols-3">
                                {fragranceTones.map((tone) => (
                                    <div key={tone.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={tone.id}
                                            checked={product.fragrance_tone_ids.includes(tone.id)}
                                            onChange={(e) => handleFragranceToneChange(e, tone.id)}
                                            className="mr-2"
                                        />
                                        <label>{tone.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

                        <Button type="submit" className="mt-6 bg-black text-white w-full">
                            {isLoading ? "กำลังบันทึก..." : "เพิ่มสินค้า"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
