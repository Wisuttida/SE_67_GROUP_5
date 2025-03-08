"use client";
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { useState } from 'react';
import axios from "axios";
import SideBarShop from '@/components/SideBarShop';

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
    image: '/path/to/initial-image1.jpg',
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
    image: '/path/to/initial-image2.jpg',
  },
];

export default function MyProductShop() {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState({
    price: '',
    fragrance: '',
    strengths: '',
    gender: '',
  });

  const handleUpdate = (id: number, key: string, value: string | number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [key]: value } : product
      )
    );
  };

  const handleEdit = (id: number) => {
    setEditingId(id); // เมื่อคลิก edit ให้ตั้งค่ารหัสของสินค้าในโหมดแก้ไข
  };

  const handleSave = () => {
    setEditingId(null); // เมื่อบันทึกให้กลับไปโหมดแสดงข้อมูล
  };

  const handleRemove = (id: number) => {
    const confirmRemove = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?");
    if (confirmRemove) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };

  const handleImageUpload = (id: number, file: File) => {
    const imageUrl = URL.createObjectURL(file);
    handleUpdate(id, 'image', imageUrl); // อัพเดตภาพที่เลือก
  };

  const filteredProducts = products
    .filter((product) => !filter.fragrance || product.fragrance === filter.fragrance)
    .filter((product) => !filter.strengths || product.strengths === filter.strengths)
    .filter((product) => !filter.gender || product.gender === filter.gender)
    .sort((a, b) => {
      if (filter.price === 'asc') return a.price - b.price;
      if (filter.price === 'desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SideBarShop />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-6">My Products</h1>

          {/* Filter Section */}
          <div className="mb-6 flex flex-wrap gap-4">
            <select onChange={(e) => setFilter({ ...filter, price: e.target.value })} className="border p-2 rounded">
              <option value="">เรียงตามราคา</option>
              <option value="asc">ต่ำไปสูง</option>
              <option value="desc">สูงไปต่ำ</option>
            </select>
            <select onChange={(e) => setFilter({ ...filter, fragrance: e.target.value })} className="border p-2 rounded">
              <option value="">ประเภทกลิ่น</option>
              <option value="Floral">Floral</option>
              <option value="Fruity">Fruity</option>
              <option value="Woody">Woody</option>
              <option value="Citrus">Citrus</option>
            </select>
            <select onChange={(e) => setFilter({ ...filter, strengths: e.target.value })} className="border p-2 rounded">
              <option value="">ความเข้ม</option>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Strong">Strong</option>
            </select>
            <select onChange={(e) => setFilter({ ...filter, gender: e.target.value })} className="border p-2 rounded">
              <option value="">เพศ</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 shadow-sm bg-white">
                <Image
                  src={product.image}
                  alt={product.productName}
                  width={200}
                  height={300}
                  className="rounded-lg"
                />
                {editingId === product.id ? (
                  <div className="mt-4 space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image upload */}
                    <div className="col-span-2">
                      <label className="block capitalize">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files ? e.target.files[0] : null;
                          if (file) {
                            handleImageUpload(product.id, file); // อัพโหลดรูปภาพใหม่
                          }
                        }}
                        className="border p-2 w-full"
                      />
                    </div>
                    {/* Edit product fields */}
                    {Object.entries(product).map(([key, value]) => (
                      key !== 'id' && key !== 'image' && key !== 'description' && key !== 'fragrance' && key !== 'strengths' && key !== 'gender' && (
                        <div key={key}>
                          <label className="block capitalize">{key}</label>
                          <input
                            type={['price', 'stock', 'volume', 'quantity'].includes(key) ? 'number' : 'text'}
                            value={value as string}
                            onChange={(e) => handleUpdate(product.id, key, e.target.value)}
                            className="border p-2 w-full"
                          />
                        </div>
                      )
                    ))}

                    {/* Edit fragrance */}
                    <div>
                      <label className="block capitalize">Fragrance</label>
                      <select
                        value={product.fragrance}
                        onChange={(e) => handleUpdate(product.id, 'fragrance', e.target.value)}
                        className="border p-2 w-full"
                      >
                        <option value="Floral">Floral</option>
                        <option value="Fruity">Fruity</option>
                        <option value="Woody">Woody</option>
                        <option value="Citrus">Citrus</option>
                      </select>
                    </div>

                    {/* Edit strengths */}
                    <div>
                      <label className="block capitalize">Strengths</label>
                      <select
                        value={product.strengths}
                        onChange={(e) => handleUpdate(product.id, 'strengths', e.target.value)}
                        className="border p-2 w-full"
                      >
                        <option value="Light">Light</option>
                        <option value="Medium">Medium</option>
                        <option value="Strong">Strong</option>
                      </select>
                    </div>

                    {/* Edit gender */}
                    <div>
                      <label className="block capitalize">Gender</label>
                      <select
                        value={product.gender}
                        onChange={(e) => handleUpdate(product.id, 'gender', e.target.value)}
                        className="border p-2 w-full"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>

                    {/* Edit description */}
                    <div className="col-span-2">
                      <label className="block capitalize">Description</label>
                      <textarea
                        value={product.description}
                        onChange={(e) => handleUpdate(product.id, 'description', e.target.value)}
                        className="border p-2 w-full h-40"
                      />
                    </div>

                    {/* Save button aligned to the right */}
                    <div className="col-span-2 flex justify-end">
                      <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-1">
                    {/* Display product details */}
                    {Object.entries(product).map(([key, value]) => (
                      key !== 'id' && key !== 'image' && (
                        <p key={key}><strong>{key}:</strong> {value}</p>
                      )
                    ))}
                    <button onClick={() => handleEdit(product.id)} className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-100 w-full">✏️ Edit</button>
                    <button onClick={() => handleRemove(product.id)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full">🗑️ Remove</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
