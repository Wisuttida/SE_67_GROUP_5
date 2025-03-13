"use client";

import Navbar from '@/components/Navbar';
import SideBarShop from '@/components/SideBarShop';
import { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { ChangeEvent} from "react";


const ShopPost = () => {
  const [activeTab, setActiveTab] = useState("MyPost");
  interface Post {
    name: string;
    price: number;
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
      price: 2,
      unit: "kg",
      amount: 5,
      description: "Sweet and juicy mangoes from organic farms.",
    },
    {
      id: "2",
      name: "Organic Avocado",
      price: 3,
      unit: "kg",
      amount: 2,
      description: "Creamy and delicious avocados, perfect for salads.",
    }
  ]);
  interface Seller {
    id: string;
    name: string;
    address : string,
    profileImage: string;
    productName: string;
    price: number;
    unit: string;
    amount: number;
    description: string;
    bankName: string;  // Name of the bank
    bankAccountNumber: string;  // Account number of the seller
    bankAccountName: string;  // Account holder's name
  }
  
  const [sellers, setSellers] = useState<Seller[]>([]);

useEffect(() => {
  // ตัวอย่างข้อมูลผู้ขาย (อาจดึงจาก API)
  setSellers([
    {
      id: "1",
      name: "สมชาย ขายดี",
      address : "กรุงเทพ",
      profileImage: "https://via.placeholder.com/50", // ใส่ URL รูปจริง
      productName: "มะนาว",
      price: 20,
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
      address : "กรุงเทพ",
      profileImage: "https://via.placeholder.com/50",
      productName: "พริกแดง",
      price: 150,
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
    price: 0,
    unit: "",
    amount: 0,
    description: "",
  });

  const [editForm, setEditForm] = useState<Post>({
    id: null,
    name: "",
    price: 0,
    unit: "",
    amount: 0,
    description: "",
    BuyAmount: 0,  // กำหนดค่าเริ่มต้นสำหรับ BuyAmount
  });

  const [showPopup, setShowPopup] = useState(false);
  const handleBuy = (sellerId: string) => {
    const seller = sellers.find(seller => seller.id === sellerId);
    if (seller) {
      alert(`ติดต่อผู้ขาย: ${seller.name}\nสินค้า: ${seller.productName}\nสถานที่: ${seller.address}`);
    }
  };
  
  const handleNotBuy = (sellerId: string) => {
    const seller = sellers.find(seller => seller.id === sellerId);
    if (!seller) return;
    confirm(`คุณแน่ใจหรือไม่ว่าคุณไม่ต้องการซื้อจาก ${seller.name}?`);
  
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
    }
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
      price: Number(editForm.price),   // Ensure price is a number
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
    if (!form.name || !form.price || !form.unit || !form.amount || !form.description) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  
    const newPost = {
      id: "",
      name: form.name,
      price: form.price,
      unit: form.unit,
      amount: form.amount,
      description: form.description,
      BuyAmount: 0,
    };
  
    setPosts([...posts, newPost]); // โพสต์ใหม่มี id ที่ถูกต้อง
    setForm({ name: "", price: 0, unit: "", amount: 0, description: "" });
  
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
        <div className="w-64 bg-gray-300 text-white p-6 min-h-screen">
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
                    name="price" 
                    placeholder="ใส่ราคา (บาท)" 
                    className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                    onChange={handleChange} 
                    value={form.price} 
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
              <button className={`p-2 flex-1 ${activeTab === "Buy" ? "border-b-2 border-black" : ""}`} onClick={() => setActiveTab("Buy")}>
                รับซื้อ
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
                    <p>{post.price} บาท ต่อ {post.unit}</p>
                    <p>ประกาศรับซื้อ {post.amount} {post.unit}</p>
                    <p>ซื้อแล้ว {post.amount} {post.unit}</p>
                    <p className="text-gray-600">{post.description}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "Buy" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {sellers.map((seller) => (
                  <div key={seller.id} className="bg-white p-4 shadow-md rounded-lg border border-gray-200 relative">
                    {/* รูปโปรไฟล์ + ชื่อผู้ขาย */}
                    <div className="flex items-center gap-3">
                      <img src={seller.profileImage} alt="profile" className="w-12 h-12 rounded-full object-cover border" />
                      <div>
                        <h3 className="text-lg font-semibold">{seller.name}</h3>
                      </div>
                    </div>
                    {/* รายละเอียดสินค้า */}
                    <div className="mt-3">
                      <p className="text-gray-700"><span className="font-medium">วัตถุดิบ:</span> {seller.productName}</p>
                      <p className="text-gray-700"><span className="font-medium">ปริมาณที่ขาย:</span> {seller.amount} {seller.unit}</p>
                      <p className="text-gray-700"><span className="font-medium">ราคา:</span> {seller.price} บาท ต่อ {seller.unit}</p>
                      <p className="text-gray-700"><span className="font-medium">ราคารวม:</span> {seller.price*seller.amount} บาท</p>
                      <p className="text-gray-700"><span className="font-medium">ที่อยู่ฟาร์ม:</span> {seller.address}</p>
                      {/* ข้อมูลธนาคาร */}
                      <div className="mt-2 p-3 border rounded bg-gray-100">
                        <h4 className="text-lg font-semibold">ข้อมูลธนาคาร</h4>
                        <p className="text-gray-700"><span className="font-medium">ชื่อบัญชี:</span> {seller.bankAccountName}</p>
                        <p className="text-gray-700"><span className="font-medium">เลขบัญชี:</span> {seller.bankAccountNumber}</p>
                        <p className="text-gray-700"><span className="font-medium">ธนาคาร:</span> {seller.bankName}</p>
                      </div>

                      {/* input รับรูปสลิปโอนเงิน */}
                      <div className="mt-4">
                        <label className="block text-gray-1000 font-medium mb-2">อัพโหลดสลิปโอนเงิน</label>
                        
                        <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-400 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={(e) => handleSlipUpload(e, seller.id)} 
                          />
                          <span className="text-gray-600">เลือกไฟล์...</span>
                        </label>

                        {slipPreviews[seller.id] && (
                          <div className="mt-3">
                            <p className="text-gray-700">ตัวอย่างสลิป:</p>
                            <img 
                              src={slipPreviews[seller.id]} 
                              alt="Slip Preview" 
                              className="w-full h-auto rounded-lg shadow-md border mt-2"
                            />
                          </div>
                        )}
                      </div>

                    </div>

                    {/* เปลี่ยนเป็นปุ่ม รับซื้อ อยู่ทางขวา และปุ่ม ไม่ซื้อ อยู่ทางซ้าย */}
                    <div className="mt-4 flex gap-4">
                      {/* ปุ่ม ไม่ซื้อ (อยู่ซ้าย) */}
                      <button 
                        onClick={() => handleNotBuy(seller.id)} 
                        className="w-1/2 bg-red-500 text-white py-2 rounded-md text-center"
                      >
                        ไม่ซื้อ
                      </button>

                      {/* ปุ่ม รับซื้อ (อยู่ขวา) */}
                      <button 
                        onClick={() => handleBuy(seller.id)} 
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
                <label htmlFor="price" className="block text-sm font-semibold">Price</label>
                <input
                  id="price"
                  name="price"
                  placeholder="Enter price"
                  className="w-full p-2 border rounded"
                  onChange={handleEditChange}
                  value={editForm.price}
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

export default ShopPost;
