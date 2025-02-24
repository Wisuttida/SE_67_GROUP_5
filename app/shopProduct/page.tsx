"use client";
import Navbar from '@/components/Navbar';
import ProfileShopMenu from '@/components/ProfileShopMenu';
import Image from 'next/image';
import { useState } from 'react';

const initialProducts = [
  {
    id: 1,
    name: 'น้ำหอม1',
    price: 50,
    image: '/images/product.png',
    description: 'A rich and warm fragrance with deep woody notes.',
  },
  {
    id: 2,
    name: 'น้ำหอม2',
    price: 50,
    image: '/images/product.png',
    description: 'A luxurious blend of agarwood and benzoin.',
  },
  {
    id: 3,
    name: 'น้ำหอม3',
    price: 50,
    image: '/images/product.png',
    description: 'A sophisticated scent perfect for any occasion.',
  },
  {
    id: 4,
    name: 'น้ำหอม4',
    price: 50,
    image: '/images/product.png',
    description: 'An elegant fragrance combining woody and sweet tones.',
  },
  {
    id: 5,
    name: 'น้ำหอม5',
    price: 50,
    image: '/images/product.png',
    description: 'A refined aroma that captures the essence of luxury.',
  },
  {
    id: 6,
    name: 'น้ำหอม6',
    price: 50,
    image: '/images/product.png',
    description: 'A timeless fragrance with a warm and inviting scent.',
  },
];

export default function shopProducts() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [products, setProducts] = useState(initialProducts);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editingId, setEditingId] = useState(null);

  const handleUpdate = (id: number, key: string, value: string | number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [key]: value } : product
      )
    );
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = () => {
    setEditingId(null);
  };

  const handleImageUpload = (id: number, file: Blob | MediaSource) => {
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
            <div key={product.id} className="border rounded-lg p-4 shadow-sm">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={400}
                className="rounded-lg"
              />
              {editingId === product.id ? (
                <>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleUpdate(product.id, 'name', e.target.value)}
                    className="mt-4 text-lg font-semibold w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleUpdate(product.id, 'price', Number(e.target.value))}
                    className="mt-2 text-gray-600 w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    value={product.description}
                    onChange={(e) => handleUpdate(product.id, 'description', e.target.value)}
                    className="mt-2 text-gray-600 w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    placeholder="Product description"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(product.id, e.target.files[0])}
                    className="mt-2 text-gray-600 w-full"
                  />
                  <button
                    onClick={handleSave}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-lg font-semibold">{product.name}</h2>
                  <p className="text-gray-600">${product.price}</p>
                  <p className="text-gray-500 mt-2">{product.description}</p>
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    🗑️ Remove
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

