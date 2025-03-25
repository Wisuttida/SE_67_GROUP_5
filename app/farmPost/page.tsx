"use client";

import Navbar from '@/components/Navbar';
import { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { ChangeEvent} from "react";
import SideBarUser from '@/components/SideBarUser';


const FarmPost = () => {
  const [activeTab, setActiveTab] = useState("MyPost");
  interface Post {
    name: string;
    price_per_unit: number;
    unit: string;
    amount: number;
    BuyAmount? : number;
    description: string;
    id: string | null; // id can be either number or null
  }
  
  const [posts, setPosts] = useState([
    {
      id: "1",
      name: "Fresh Mango",
      price_per_unit: 2,
      unit: "kg",
      amount: 5,
      description: "Sweet and juicy mangoes from organic farms.",
    },
    {
      id: "2",
      name: "Organic Avocado",
      price_per_unit: 3,
      unit: "kg",
      amount: 2,
      description: "Creamy and delicious avocados, perfect for salads.",
    }
  ]);
  interface Buyer {
    id: string;
    name: string;
    profileImage: string;
    productName: string;
    price_per_unit: number;
    unit: string;
    amount: number;
    description: string;
    bankName: string;  // Name of the bank
    bankAccountNumber: string;  // Account number of the seller
    bankAccountName: string;  // Account holder's name
  }
  
  const [buyers, setBuyers] = useState<Buyer[]>([]);

useEffect(() => {
  // ตัวอย่างข้อมูลผู้ขาย (อาจดึงจาก API)
  setBuyers([
    {
      id: "1",
      name: "สมชาย ขายดี",
      profileImage: "https://via.placeholder.com/50", // ใส่ URL รูปจริง
      productName: "มะนาว",
      price_per_unit: 20,
      unit: "กิโลกรัม",
      amount: 50,
      description: "มะนาวสดจากสวน ปลูกแบบออร์แกนิค",
      bankName : "ไทยพาณิชย์",
      bankAccountNumber: "123456789",
      bankAccountName: "สมชาย ขายดี",
    },
    {
      id: "2",
      name: "แม่ส้ม แม่ค้าใจดี",
      profileImage: "https://via.placeholder.com/50",
      productName: "พริกแดง",
      price_per_unit: 150,
      unit: "กิโลกรัม",
      amount: 20,
      description: "พริกแดงแห้งคุณภาพดี เผ็ดสะใจ",
      bankName : "ไทยพาณิชย์",
      bankAccountNumber: "123456789",
      bankAccountName: "สมชาย ขายดี",
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
    id: null,
    name: "",
    price_per_unit: 0,
    unit: "",
    amount: 0,
    description: "",
    BuyAmount: 0,  // กำหนดค่าเริ่มต้นสำหรับ BuyAmount
  });

  const [showPopup, setShowPopup] = useState(false);
  const handleBuy = (buyerId: string) => {
    const buyer = buyers.find(buyer => buyer.id === buyerId);
    if (buyer) {
      alert(`ยืนยัน`);
    }
  };
  
  const handleNotSell = (buyerId: string) => {
    const buyer = buyers.find(buyer => buyer.id === buyerId);
    if (!buyer) return;
    confirm(`คุณแน่ใจหรือไม่ว่าคุณไม่ต้องการขายให้ ${buyer.name}?`);
  
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    // Ensure the types match exactly
    const updatedForm = {
      ...editForm,
      id: String(editForm.id),        // Make sure id is a string
      price_per_unit: Number(editForm.price_per_unit),   // Ensure price_per_unit is a number
      amount: Number(editForm.amount), // Ensure amount is a number
    };
  
    // Update the post
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedForm.id ? { ...post, ...updatedForm } : post
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
      id: "",
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
    if (post.id !== null) {
      setEditForm({ ...post });
      setShowPopup(true);
    }
  };
  
  

  const handleCancel = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <SideBarUser/>
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
              <button className={`p-2 flex-1 ${activeTab === "Sell" ? "border-b-2 border-black" : ""}`} onClick={() => setActiveTab("Sell")}>
                ขาย
              </button>
            </div>
            {activeTab === "MyPost" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-50 p-4 shadow-md rounded-lg border border-gray-200 relative">
                    <div className="absolute top-2 right-2 cursor-pointer group">
                      <FiMoreVertical className="text-gray-600" />
                      <div className="hidden group-hover:block absolute right-0 bg-white shadow-md rounded-lg p-2">
                        <button onClick={() => handleCancel(post.id)} className="block text-red-500 px-3 py-1">ยกเลิก</button>
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
            {activeTab === "Sell" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {buyers.map((buyer) => (
                  <div key={buyer.id} className="bg-white p-4 shadow-md rounded-lg border border-gray-200 relative">
                    {/* รูปโปรไฟล์ + ชื่อผู้ซื้อ */}
                    <div className="flex items-center gap-3">
                      <img src={buyer.profileImage} alt="profile" className="w-12 h-12 rounded-full object-cover border" />
                      <div>
                        <h3 className="text-lg font-semibold">{buyer.name}</h3>
                      </div>
                    </div>
                    {/* รายละเอียดสินค้า */}
                    <div className="mt-3">
                      <p className="text-gray-700"><span className="font-medium">วัตถุดิบ:</span> {buyer.productName}</p>
                      <p className="text-gray-700"><span className="font-medium">ปริมาณที่ซื้อ:</span> {buyer.amount} {buyer.unit}</p>
                      <p className="text-gray-700"><span className="font-medium">ราคา:</span> {buyer.price_per_unit} บาท ต่อ {buyer.unit}</p>
                      <p className="text-gray-700"><span className="font-medium">ราคารวม:</span> {buyer.price_per_unit*buyer.amount} บาท</p>

                      {/* เปลี่ยนเป็นดูสลิปโอนเงินอย่างเดียว ไม่ต้องรับ input */}
                        <div className="mt-4">
                        <label className="block text-gray-1000 font-medium mb-2">สลิปโอนเงิน</label>
                        <img 
                            src="image" 
                            alt="Slip Preview" 
                            className="w-full h-auto rounded-lg shadow-md border mt-2"
                        />
                        </div>
                    </div>

                    {/* ปุ่ม */}
                    <div className="mt-4 flex gap-4">
                      {/* ปฎิเสธ */}
                      <button 
                        onClick={() => handleNotSell(buyer.id)} 
                        className="w-1/2 bg-red-500 text-white py-2 rounded-md text-center"
                      >
                        ปฎิเสธ
                      </button>

                      {/* ยืนบัน */}
                      <button 
                        onClick={() => handleBuy(buyer.id)} 
                        className="w-1/2 bg-green-500 text-white py-2 rounded-md text-center"
                      >
                        ยืนบัน
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
                <label htmlFor="name" className="block text-sm font-semibold">Product Name</label>
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
                <label htmlFor="price_per_unit" className="block text-sm font-semibold">Price_per_unit</label>
                <input
                  id="price_per_unit"
                  name="price_per_unit"
                  placeholder="Enter price_per_unit"
                  className="w-full p-2 border rounded"
                  onChange={handleEditChange}
                  value={editForm.price_per_unit}
                />
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-semibold">Unit</label>
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
                <label htmlFor="amount" className="block text-sm font-semibold">Amount</label>
                <input
                  id="amount"
                  name="amount"
                  placeholder="Enter amount"
                  className="w-full p-2 border rounded"
                  onChange={handleEditChange}
                  value={editForm.amount}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-semibold">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  className="w-full p-2 border rounded"
                  onChange={handleEditChange}
                  value={editForm.description}
                />
              </div>
              <button type="submit" className="w-full bg-black text-white py-2 rounded-md">Update</button>
              <button
                type="button"
                className="w-full bg-gray-300 text-black py-2 rounded-md mt-2"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmPost;
