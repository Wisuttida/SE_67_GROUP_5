"use client";

import Navbar from '@/components/Navbar';
import SideBarShop from '@/components/SideBarShop';
import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { ChangeEvent, FormEvent } from "react";

const ShopPost = () => {
  const [activeTab, setActiveTab] = useState("MyPost");
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

  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    price: "",
    unit: "",
    amount: "",
    description: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPosts([...posts, { ...form, id: Date.now() }]);
    setForm({ name: "", price: "", unit: "", amount: "", description: "" });
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPosts(posts.map(post => post.id === editForm.id ? { ...editForm } : post));
    setShowPopup(false);
  };

  const handleEdit = (post: any) => {
    setEditForm({ ...post }); // Ensure all fields are populated correctly
    setShowPopup(true);
  };

  const handleCancel = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
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
              <input name="name" placeholder="Enter product name" className="w-full p-2 border rounded" onChange={handleChange} value={form.name} />
              <input name="price" placeholder="Enter price" className="w-full p-2 border rounded" onChange={handleChange} value={form.price} />
              <input name="unit" placeholder="Enter unit" className="w-full p-2 border rounded" onChange={handleChange} value={form.unit} />
              <input name="amount" placeholder="Enter amount" className="w-full p-2 border rounded" onChange={handleChange} value={form.amount} />
              <textarea name="description" placeholder="Enter description" className="w-full p-2 border rounded" onChange={handleChange} value={form.description} />
              <button type="submit" className="w-full bg-black text-white py-2 rounded-md">Post</button>
            </form>
          </div>
          <div className="mt-6 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex border-b">
              <button className={`p-2 flex-1 ${activeTab === "MyPost" ? "border-b-2 border-black" : ""}`} onClick={() => setActiveTab("MyPost")}>
                My Post
              </button>
              <button className={`p-2 flex-1 ${activeTab === "Buy" ? "border-b-2 border-black" : ""}`} onClick={() => setActiveTab("Buy")}>
                Buy
              </button>
            </div>

            {activeTab === "MyPost" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-50 p-4 shadow-md rounded-lg border border-gray-200 relative">
                    <div className="absolute top-2 right-2 cursor-pointer group">
                      <FiMoreVertical className="text-gray-600" />
                      <div className="hidden group-hover:block absolute right-0 bg-white shadow-md rounded-lg p-2">
                        <button onClick={() => handleCancel(post.id)} className="block text-red-500 px-3 py-1">Cancel</button>
                        <button onClick={() => handleEdit(post)} className="block text-gray-700 px-3 py-1">Edit</button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mt-2">{post.name}</h3>
                    <p>${post.price} per {post.unit}</p>
                    <p>{post.amount} {post.unit}</p>
                    <p className="text-gray-600">{post.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input name="name" placeholder="Enter product name" className="w-full p-2 border rounded" onChange={handleEditChange} value={editForm.name} />
              <input name="price" placeholder="Enter price" className="w-full p-2 border rounded" onChange={handleEditChange} value={editForm.price} />
              <input name="unit" placeholder="Enter unit" className="w-full p-2 border rounded" onChange={handleEditChange} value={editForm.unit} />
              <input name="amount" placeholder="Enter amount" className="w-full p-2 border rounded" onChange={handleEditChange} value={editForm.amount} />
              <textarea name="description" placeholder="Enter description" className="w-full p-2 border rounded" onChange={handleEditChange} value={editForm.description} />
              <button type="submit" className="w-full bg-black text-white py-2 rounded-md">Update</button>
              <button type="button" className="w-full bg-gray-300 text-black py-2 rounded-md mt-2" onClick={() => setShowPopup(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPost;
