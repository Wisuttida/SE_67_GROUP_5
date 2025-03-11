"use client";

import Navbar from '@/components/Navbar';
import SideBarShop from '@/components/SideBarShop';
import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

const ShopPost = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Fresh Mango",
      price: "2",
      unit: "kg",
      amount: "5",
      description: "Sweet and juicy mangoes from organic farms.",
    },
    {
      id: 2,
      name: "Organic Avocado",
      price: "3",
      unit: "kg",
      amount: "2",
      description: "Creamy and delicious avocados, perfect for salads.",
    }
  ]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
    amount: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPosts([...posts, { ...form, id: Date.now(), status: "Buy" }]);
    setForm({ name: "", price: "", unit: "", amount: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <div className="w-64 bg-gray-300 text-white p-6 min-h-screen">
          <SideBarShop />
        </div>
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Product Name</label>
                <input name="name" placeholder="Enter product name" className="w-full p-2 border rounded" onChange={handleChange} value={form.name} />
              </div>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-gray-700">Price</label>
                  <input name="price" placeholder="Enter price" className="w-full p-2 border rounded" onChange={handleChange} value={form.price} />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700">Unit</label>
                  <input name="unit" placeholder="Enter unit" className="w-full p-2 border rounded" onChange={handleChange} value={form.unit} />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Amount</label>
                <input name="amount" placeholder="Enter amount" className="w-full p-2 border rounded" onChange={handleChange} value={form.amount} />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea name="description" placeholder="Enter description" className="w-full p-2 border rounded" onChange={handleChange} value={form.description} />
              </div>
              <button type="submit" className="w-full bg-black text-white py-2 rounded-md">Post</button>
            </form>
          </div>

          <div className="mt-6 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-center mb-4">My Post</h2>
            <div className="grid grid-cols-2 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-50 p-4 shadow-md rounded-lg border border-gray-200 relative">
                  <div className="absolute top-2 right-2 cursor-pointer group">
                    <FiMoreVertical className="text-gray-600" />
                    <div className="hidden group-hover:block absolute right-0 bg-white shadow-md rounded-lg p-2">
                      <button className="block text-red-500 px-3 py-1">Cancel</button>
                      <button className="block text-gray-700 px-3 py-1">Edit</button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mt-2">{post.name}</h3>
                  <p>${post.price} per {post.unit}</p>
                  <p>{post.amount} {post.unit}</p>
                  <p className="text-gray-600">{post.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShopPost;