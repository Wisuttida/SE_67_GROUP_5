"use client";
import Navbar from '@/components/Navbar';
import ProfileShopMenu from '@/components/ProfileShopMenu';
import Image from 'next/image';
import { useState } from 'react';
import axios from "axios";
const initialProducts = [
  {
    id: 1,
    productName: 'น้ำหอม1',
    price: 50,
    stock: 100,
    quantity: 1,
    fragrance: 'Floral',
    strengths: 'Light',
    volume: 50,
    gender: 'Unisex',
    description: 'A rich and warm fragrance with deep woody notes.',
    image: '/images/product.png',
  },
  {
    id: 2,
    productName: 'น้ำหอม2',
    price: 75,
    stock: 50,
    quantity: 1,
    fragrance: 'Woody',
    strengths: 'Medium',
    volume: 100,
    gender: 'Male',
    description: 'A luxurious blend of agarwood and benzoin.',
    image: '/images/product.png',
  },
];

export default function MyProductShop() {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleUpdate = (id: number, key: string, value: string | number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [key]: value } : product
      )
    );
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleSave = () => {
    setEditingId(null);
  };

  const handleImageUpload = (id: number, file: File) => {
    const imageUrl = URL.createObjectURL(file);
    handleUpdate(id, 'image', imageUrl);
  };

  const handleRemove = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <ProfileShopMenu />
        <h1 className="text-2xl font-bold mb-6">My Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <Image
                src={product.image}
                alt={product.productName}
                width={300}
                height={400}
                className="rounded-lg"
              />
              {editingId === product.id ? (
                <div className="mt-4 space-y-2">
                  <label className="block">
                    <span className="text-sm font-medium">ชื่อสินค้า</span>
                    <input
                      type="text"
                      value={product.productName}
                      onChange={(e) =>
                        handleUpdate(product.id, 'productName', e.target.value)
                      }
                      className="mt-1 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="ชื่อสินค้า"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ราคา</span>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        handleUpdate(product.id, 'price', Number(e.target.value))
                      }
                      className="mt-1 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="ราคา"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">จำนวนในคลัง</span>
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) =>
                        handleUpdate(product.id, 'stock', Number(e.target.value))
                      }
                      className="mt-1 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="จำนวนในคลัง"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ขั้นต่ำในการสั่งซื้อ</span>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleUpdate(product.id, 'quantity', Number(e.target.value))
                      }
                      className="mt-1 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="ขั้นต่ำในการสั่งซื้อ"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ปริมาณ</span>
                    <input
                      type="number"
                      value={product.volume}
                      onChange={(e) =>
                        handleUpdate(product.id, 'volume', Number(e.target.value))
                      }
                      className="mt-1 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="ปริมาณ"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">คำอธิบายสินค้า</span>
                    <textarea
                      value={product.description}
                      onChange={(e) =>
                        handleUpdate(product.id, 'description', e.target.value)
                      }
                      className="mt-1 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="คำอธิบายสินค้า"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ประเภทกลิ่น</span>
                    <select
                      value={product.fragrance}
                      onChange={(e) =>
                        handleUpdate(product.id, 'fragrance', e.target.value)
                      }
                      className="mt-1 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Floral">Floral</option>
                      <option value="Fruity">Fruity</option>
                      <option value="Woody">Woody</option>
                      <option value="Citrus">Citrus</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ความเข้ม</span>
                    <select
                      value={product.strengths}
                      onChange={(e) =>
                        handleUpdate(product.id, 'strengths', e.target.value)
                      }
                      className="mt-1 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Light">Light</option>
                      <option value="Medium">Medium</option>
                      <option value="Strong">Strong</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">เพศ</span>
                    <select
                      value={product.gender}
                      onChange={(e) =>
                        handleUpdate(product.id, 'gender', e.target.value)
                      }
                      className="mt-1 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">รูปสินค้า</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(product.id, e.target.files[0])
                      }
                      className="mt-1 block w-full"
                    />
                  </label>
                  <button
                    onClick={handleSave}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-1">
                  <p>
                    <strong>ชื่อสินค้า:</strong> {product.productName}
                  </p>
                  <p>
                    <strong>ราคา:</strong> ฿{product.price}
                  </p>
                  <p>
                    <strong>จำนวนในคลัง:</strong> {product.stock}
                  </p>
                  <p>
                    <strong>ขั้นต่ำในการสั่งซื้อ:</strong> {product.quantity}
                  </p>
                  <p>
                    <strong>ปริมาณ:</strong> {product.volume}
                  </p>
                  <p>
                    <strong>คำอธิบายสินค้า:</strong> {product.description}
                  </p>
                  <p>
                    <strong>ประเภทกลิ่น:</strong> {product.fragrance}
                  </p>
                  <p>
                    <strong>ความเข้ม:</strong> {product.strengths}
                  </p>
                  <p>
                    <strong>เพศ:</strong> {product.gender}
                  </p>
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-100 w-full"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
                  >
                    🗑️ Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
