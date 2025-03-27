"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import SideBarShop from "@/components/SideBarShop";
import axios from "axios";

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
            let imageUrl = "";

            // Upload the image if a file is selected
            if (selectedFile) {
                const imageFormData = new FormData();
                imageFormData.append("file", selectedFile);

                const uploadRes = await axios.post("/api/upload", imageFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                console.log("Upload response:", uploadRes.data);

                // Extract the filePath from the response
                imageUrl = uploadRes.data.filePath;

                // Prepend the base URL if the filePath is relative
                if (imageUrl && !imageUrl.startsWith("http")) {
                    imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
                }

                // Validate the returned URL
                if (!imageUrl || !imageUrl.startsWith("http")) {
                    throw new Error(`Invalid image URL returned from the server: ${imageUrl}`);
                }
            }

            // Format the payload to match backend requirements
            const formData = {
                ...product,
                ...(imageUrl && { image_url: imageUrl }), // Include image_url only if it's valid
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
            router.push("/shop/products");

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

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex">
                <SideBarShop />
                <div className="flex-1 p-5 bg-gray-100">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
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
                                    type="number"
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
                                    type="number"
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
                                    type="number"
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
                                <option value="">เลือกเพศ</option>
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
                            <div className="space-y-2">
                                {[1, 2, 3, 4].map((toneId) => (
                                    <div key={toneId} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={toneId}
                                            checked={product.fragrance_tone_ids.includes(toneId)}
                                            onChange={(e) => handleFragranceToneChange(e, toneId)}
                                            className="mr-2"
                                        />
                                        <label>Tone {toneId}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-700">อัปโหลดรูปภาพ</label>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="p-2 border rounded-lg w-full"
                            />
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
