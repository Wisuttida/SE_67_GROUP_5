"use client";

import Navbar from '@/components/Navbar';
import SideBarShop from '@/components/SideBarShop';
import { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { ChangeEvent} from "react";


const ShopPost = () => {
  const [activeTab, setActiveTab] = useState("MyPost");
  interface Post {
    ingredients_ingredient_id: string; // เพิ่มตาม database ยังไม่ได้ใช้เกี่ยวกับการดึงข้อมูล
    name: string; //ingrediant name
    price_per_unit: number;
    unit: string;
    amount: number;
    BuyAmount? : number;
    description: string;
    post_id: string | null; // id can be either number or null
    bought : number;
  }
  
  const [posts, setPosts] = useState([
    {
      ingredients_ingredient_id:"",
      post_id: "1",
      name: "Fresh Mango",
      price_per_unit: 2,
      unit: "kg",
      amount: 5,
      description: "Sweet and juicy mangoes from organic farms.",
      bought : 3
    },
    {
      ingredients_ingredient_id:"",
      post_id: "2",
      name: "Organic Avocado",
      price_per_unit: 3,
      unit: "kg",
      amount: 2,
      description: "Creamy and delicious avocados, perfect for salads.",
      bought : 1
    }
  ]);
  interface Seller {
    farm_id: string;
    farm_name: string;
    farm_image: string;
    name: string;
    total_price:number;
    price_per_unit: number;
    unit: string;
    amount: number;
    description: string;
    bank_name: string;  // Name of the bank
    bank_number: string;  // Account number of the seller
    bank_account: string;  // Account holder's name
  }
  
  const [sellers, setSellers] = useState<Seller[]>([]);

useEffect(() => {
  // ตัวอย่างข้อมูลผู้ขาย (อาจดึงจาก API)
  setSellers([
    {
      farm_id: "1",
      farm_name: "สมชาย ขายดี",
      farm_image: "https://via.placeholder.com/50", // ใส่ URL รูปจริง
      name: "มะนาว",
      price_per_unit: 20,
      unit: "กิโลกรัม",
      amount: 50,
      total_price: 1000,
      description: "มะนาวสดจากสวน ปลูกแบบออร์แกนิค",
      bank_name : "ไทยพาณิชย์",
      bank_number: "123456789",
      bank_account: "สมชาย ขายดี",
    },
    {
      farm_id: "2",
      farm_name: "แม่ส้ม แม่ค้าใจดี",
      farm_image: "https://via.placeholder.com/50",
      name: "พริกแดง",
      price_per_unit: 150,
      unit: "กิโลกรัม",
      amount: 20,
      total_price: 3000,
      description: "พริกแดงแห้งคุณภาพดี เผ็ดสะใจ",
      bank_name : "ไทยพาณิชย์",
      bank_number: "123456789",
      bank_account: "สมชาย ขายดี",
    },
  ]);
}, []);

  const [form, setForm] = useState({
    name: "",
    price_per_unit: 0,
    unit: "",
    amount: 0,
    description: "",
  });

  const [editForm, setEditForm] = useState<Post>({
    ingredients_ingredient_id:"",
    post_id: null,
    name: "",
    price_per_unit: 0,
    unit: "",
    amount: 0,
    description: "",
    BuyAmount: 0,  // กำหนดค่าเริ่มต้นสำหรับ BuyAmount
    bought : 0
  });

  const [showPopup, setShowPopup] = useState(false);
  const handleBuy = (sellerId: string) => {
    if (!slipPreviews[sellerId]) {
      alert("กรุณาอัพโหลดหลักฐานการโอน");
      return;
  }
    const seller = sellers.find(seller => seller.farm_id === sellerId);
    if (seller) {
      alert(`รับซื้อ`);
    }
  };
  
  const handleNotBuy = (sellerId: string) => {
    const seller = sellers.find(seller => seller.farm_id === sellerId);
    if (!seller) return;
    confirm(`คุณแน่ใจหรือไม่ว่าคุณไม่ต้องการซื้อจาก ${seller.farm_name}?`);
  
  };
  
  const [slipPreviews, setSlipPreviews] = useState<{ [key: string]: string }>({});
  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>, sellerId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSlipPreviews(prev => ({ ...prev, [sellerId]: reader.result as string }));
      };
      reader.readAsDataURL(file);
      e.target.value = ""; // รีเซ็ตค่า input
    }
  };
  const removePreview = (sellerId: string) => {
    setSlipPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[sellerId];
      return newPreviews;
    });
  };

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
      ingredients_ingredient_id:"",
      post_id: "",
      name: form.name,
      price_per_unit: form.price_per_unit,
      unit: form.unit,
      amount: form.amount,
      description: form.description,
      BuyAmount: 0,
      bought:0
    };
  
    setPosts([...posts, newPost]); // โพสต์ใหม่มี id ที่ถูกต้อง
    setForm({ name: "", price_per_unit: 0, unit: "", amount: 0, description: ""});
  
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
          <SideBarShop />
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
              <button className={`p-2 flex-1 ${activeTab === "Buy" ? "border-b-2 border-black" : ""}`} onClick={() => setActiveTab("Buy")}>
                รับซื้อ
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
                    <p>ประกาศรับซื้อ {post.amount} {post.unit}</p>
                    <p>ซื้อแล้ว {post.bought} {post.unit}</p>
                    <p className="text-gray-600">{post.description}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "Buy" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {sellers.map((seller) => (
                  <div key={seller.farm_id} className="bg-white p-4 shadow-md rounded-lg border border-gray-200 relative">
                    {/* รูปโปรไฟล์ + ชื่อผู้ขาย */}
                    <div className="flex items-center gap-3">
                      <img src={seller.farm_image} alt="profile" className="w-12 h-12 rounded-full object-cover border" />
                      <div>
                        <h3 className="text-lg font-semibold">{seller.farm_name}</h3>
                      </div>
                    </div>
                    {/* รายละเอียดสินค้า */}
                    <div className="mt-3">
                      <p className="text-gray-700"><span className="font-medium">วัตถุดิบ:</span> {seller.name}</p>
                      <p className="text-gray-700"><span className="font-medium">ปริมาณที่ขาย:</span> {seller.amount} {seller.unit}</p>
                      <p className="text-gray-700"><span className="font-medium">ราคา:</span> {seller.price_per_unit} บาท ต่อ {seller.unit}</p>
                      <p className="text-gray-700"><span className="font-medium">ราคารวม:</span> {seller.total_price} บาท</p>
                      {/* ข้อมูลธนาคาร */}
                      <div className="mt-2 p-3 border rounded bg-gray-100">
                        <h4 className="text-lg font-semibold">ข้อมูลธนาคาร</h4>
                        <p className="text-gray-700"><span className="font-medium">ชื่อบัญชี:</span> {seller.bank_account}</p>
                        <p className="text-gray-700"><span className="font-medium">เลขบัญชี:</span> {seller.bank_number}</p>
                        <p className="text-gray-700"><span className="font-medium">ธนาคาร:</span> {seller.bank_name}</p>
                      </div>

                      {/* input รับรูปสลิปโอนเงิน */}
                      <div className="mt-4">
                        <label className="block text-gray-1000 font-medium mb-2">อัพโหลดสลิปโอนเงิน</label>

                        <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-400 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleSlipUpload(e, seller.farm_id)} // ใช้ seller.id
                          />
                          <span className="text-gray-600">เลือกไฟล์...</span>
                        </label>

                        {slipPreviews[seller.farm_id] && (
                          <div className="mt-3 relative inline-block"> {/* เพิ่ม relative ที่นี่ */}
                            <p className="text-gray-700">ตัวอย่างสลิป:</p>
                            <img
                              src={slipPreviews[seller.farm_id]}
                              alt="Slip Preview"
                              className="w-full h-auto rounded-lg shadow-md border mt-2"
                            />
                            {/* ปุ่มกากบาท */}
                            <button
                              onClick={() => removePreview(seller.farm_id)} // ใช้ seller.id แทนการฮาร์ดโค้ด
                              className="absolute top-8 right-1 bg-gray-500 text-white rounded-full p-1 shadow hover:bg-gray-600 transition opacity-10absolute top-2 right-2 bg-gray-500 text-white rounded-full p-2 shadow opacity-50 hover:opacity-100 hover:bg-gray-600 transition0 hover:opacity-500"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>


                    </div>
                    {/* ปุ่ม */}
                    <div className="mt-4 flex gap-4">
                      {/* ปุ่ม ไม่ซื้อ */}
                      <button 
                        onClick={() => handleNotBuy(seller.farm_id)} 
                        className={`w-1/2 py-2 rounded-md text-center ${slipPreviews[seller.farm_id] ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 text-white"}`}
                        disabled={!!slipPreviews[seller.farm_id]}
                      >
                        ไม่ซื้อ
                      </button>

                      {/* ปุ่ม รับซื้อ */}
                      <button 
                        onClick={() => handleBuy(seller.farm_id)} 
                        className="w-1/2 bg-green-500 text-white py-2 rounded-md text-center"
                      >
                        รับซื้อ
                      </button>
                    </div>

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

export default ShopPost;
