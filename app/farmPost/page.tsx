"use client";

import Navbar from '@/components/Navbar';
import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { ChangeEvent} from "react";
import SideBarFarm from '@/components/SideBarFarm';


const FarmPost = () => {
  const [activeTab, setActiveTab] = useState("MyPost");
  interface Post {
    name: string;
    price_per_unit: number;
    unit: string;
    amount: number;
    BuyAmount? : number;
    description: string;
    post_id: string | null; // id can be either number or null
  }
  
  const [posts, setPosts] = useState([
    {
      post_id: "1",
      name: "Fresh Mango",
      price_per_unit: 2,
      unit: "kg",
      amount: 5,
      description: "Sweet and juicy mangoes from organic farms.",
    },
    {
      post_id: "2",
      name: "Organic Avocado",
      price_per_unit: 3,
      unit: "kg",
      amount: 2,
      description: "Creamy and delicious avocados, perfect for salads.",
    }
  ]);


  const [form, setForm] = useState({
    name: "",
    price_per_unit: 0,
    unit: "",
    amount: 0,
    description: "",
  });

  const [editForm, setEditForm] = useState<Post>({
    post_id: null,
    name: "",
    price_per_unit: 0,
    unit: "",
    amount: 0,
    description: "",
    BuyAmount: 0,  // กำหนดค่าเริ่มต้นสำหรับ BuyAmount
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    // Ensure the types match exactly
    const updatedForm = {
      ...editForm,
      post_id: String(editForm.post_id),        // Make sure id is a string
      price_per_unit: Number(editForm.price_per_unit),   // Ensure price_per_unit is a number
      amount: Number(editForm.amount), // Ensure amount is a number
    };
  
    // Update the post
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.post_id === updatedForm.post_id ? { ...post, ...updatedForm } : post
      )
    );
  
    // Close the popup
    setShowPopup(false);
};
  
  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handlePost = () => {
    if (!form.name || !form.price_per_unit || !form.unit || !form.amount || !form.description) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  
    const newPost = {
      post_id: "",
      name: form.name,
      price_per_unit: form.price_per_unit,
      unit: form.unit,
      amount: form.amount,
      description: form.description,
      BuyAmount: 0,
    };
  
    setPosts([...posts, newPost]); // โพสต์ใหม่มี id ที่ถูกต้อง
    setForm({ name: "", price_per_unit: 0, unit: "", amount: 0, description: "" });
  
    alert("โพสต์สำเร็จ!");
  };
  

  const handleEdit = (post: Post) => {
    if (post.post_id !== null) {
      setEditForm({ ...post });
      setShowPopup(true);
    }
  };
  
  

  const handleCancel = (id: string) => {
    setPosts(posts.filter(post => post.post_id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <div>
        <SideBarFarm/>
        </div>
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">สร้างโพสต์</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-1000 font-medium">ชื่อวัตถุดิบ</label>
                <input 
                  name="name" 
                  placeholder="ใส่ชื่อวัตถุดิบ" 
                  className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                  onChange={handleChange} 
                  value={form.name} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-1000 font-medium">ราคา(บาท) ต่อหน่วย</label>
                  <input 
                    name="price_per_unit" 
                    placeholder="ใส่ราคา (บาท)" 
                    className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                    type="number"  // ใช้ type="number" เพื่อรับแค่ตัวเลข
                    min="0"        // กำหนดขั้นต่ำที่ 0 หรือปรับตามต้องการ
                    step="0.5"
                    onChange={handleChange} 
                    value={form.price_per_unit} 
                  />
                </div>
                <div>
                  <label className="block text-gray-1000 font-medium">หน่วย</label>
                  <input 
                    name="unit" 
                    placeholder="ใส่หน่วย (kg, g หรืออื่นๆ) " 
                    className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                    onChange={handleChange} 
                    value={form.unit} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-1000 font-medium">ปริมาณ</label>
                <input 
                  name="amount" 
                  placeholder="ใส่ปริมาณ" 
                  className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                  type="number"  // ใช้ type="number" เพื่อรับแค่ตัวเลข
                  min="0"        // กำหนดขั้นต่ำที่ 0 หรือปรับตามต้องการ
                  step="0.5"
                  onChange={handleChange} 
                  value={form.amount} 
                />
              </div>
              <div>
                <label className="block text-gray-1000 font-medium">รายละเอียด</label>
                <textarea 
                  name="description" 
                  placeholder="ใส่รายละเอียด" 
                  className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                  onChange={handleChange} 
                  value={form.description} 
                />
              </div>
              <button 
                type="button" 
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                onClick={handlePost}
              >
                โพสต์
              </button>

            </form>
          </div>
          <div className="mt-6 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex border-b">
              <button className={`p-2 flex-1 ${activeTab === "MyPost" ? "border-b-2 border-black" : ""}`} onClick={() => setActiveTab("MyPost")}>
                โพสต์ของฉัน
              </button>
            </div>
            {activeTab === "MyPost" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {posts.map((post) => (
                  <div key={post.post_id} className="bg-gray-50 p-4 shadow-md rounded-lg border border-gray-200 relative">
                    <div className="absolute top-2 right-2 cursor-pointer group">
                      <FiMoreVertical className="text-gray-600" />
                      <div className="hidden group-hover:block absolute right-0 bg-white shadow-md rounded-lg p-2">
                        <button onClick={() => handleCancel(post.post_id)} className="block text-red-500 px-3 py-1">ยกเลิก</button>
                        <button onClick={() => handleEdit(post)} className="block text-gray-700 px-3 py-1">แก้ไข</button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mt-2">{post.name}</h3>
                    <p>{post.price_per_unit} บาท ต่อ {post.unit}</p>
                    <p>ประกาศขาย {post.amount} {post.unit}</p>
                    <p>ขายแล้ว {post.amount} {post.unit}</p>
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
              <div>
                <label htmlFor="name" className="block text-sm font-semibold">ชื่อวัตถุดิบ</label>
                <input
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  className="w-full p-2 border rounded"
                  onChange={handleEditChange}
                  value={editForm.name}
                />
              </div>
              <div>
                <label htmlFor="price_per_unit" className="block text-sm font-semibold">ราคา(บาท) ต่อหน่วย</label>
                <input
                  id="price_per_unit"
                  name="price_per_unit"
                  placeholder="Enter price_per_unit"
                  className="w-full p-2 border rounded"
                  type="number"  // ใช้ type="number" เพื่อรับแค่ตัวเลข
                  min="0"        // กำหนดขั้นต่ำที่ 0 หรือปรับตามต้องการ
                  step="0.5"
                  onChange={handleEditChange}
                  value={editForm.price_per_unit}
                />
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-semibold">หน่วย</label>
                <input
                  id="unit"
                  name="unit"
                  placeholder="Enter unit"
                  className="w-full p-2 border rounded"
                  onChange={handleEditChange}
                  value={editForm.unit}
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold">ปริมาณ</label>
                <input
                  id="amount"
                  name="amount"
                  placeholder="Enter amount"
                  className="w-full p-2 border rounded"
                  type="number"  // ใช้ type="number" เพื่อรับแค่ตัวเลข
                  min="0"        // กำหนดขั้นต่ำที่ 0 หรือปรับตามต้องการ
                  step="0.5"
                  onChange={handleEditChange}
                  value={editForm.amount}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-semibold">รายละเอียด</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  className="w-full p-2 border rounded"
                  onChange={handleEditChange}
                  value={editForm.description}
                />
              </div>
              <button type="submit" className="w-full bg-black text-white py-2 rounded-md">แก้ไข</button>
              <button
                type="button"
                className="w-full bg-gray-300 text-black py-2 rounded-md mt-2"
                onClick={() => setShowPopup(false)}
              >
                ยกเลิก
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmPost;
