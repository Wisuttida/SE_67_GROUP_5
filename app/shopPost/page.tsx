"use client";

import Navbar from '@/components/Navbar';
import SideBarShop from '@/components/SideBarShop';
import { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import axios from 'axios';

interface Ingredient {
  ingredient_id: number;
  name: string;
}

interface Post {
  ingredients_id: string;
  name: string;
  price_per_unit: number;
  unit: string;
  amount: number;
  description: string;
  post_id: string | null;
  bought: number;
}
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
const ShopPost = () => {
  const [activeTab, setActiveTab] = useState("MyPost");
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({
    price_per_unit: 0,
    unit: "",
    amount: 0,
    description: "",
    ingredients_id: "", 
  });
  const [editForm, setEditForm] = useState<Post>({
    ingredients_id: "",
    post_id: null,
    name: "",
    price_per_unit: 0,
    unit: "",
    amount: 0,
    description: "",
    bought: 0
  });
  const [showPopup, setShowPopup] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [offers, setOffers] = useState([]);
  const authToken = localStorage.getItem('token');
  
  // ตรวจสอบว่า authToken มีค่าไหม
  if (!authToken) {
    console.error('Authorization token not found');
  }
  
  // useEffect สำหรับดึง CSRF Token
  useEffect(() => {
    if (!authToken) return;
    axios.get('http://localhost:8000/csrf-token', { withCredentials: true })
      .then(response => {
        setCsrfToken(response.data.csrf_token);
      })
      .catch(error => {
        console.error("Error fetching CSRF Token:", error);
      });
  }, [authToken]); // useEffect นี้ไม่ต้องการการเช็ค authToken

  // useEffect สำหรับดึงข้อมูลโพสต์และข้อเสนอจาก API
  useEffect(() => {
    if (authToken && csrfToken) {
      axios.get('http://localhost:8000/api/offers-by-user-posts', {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Authorization': `Bearer ${authToken}`,  // ส่ง token ที่ได้จากการล็อกอิน
        },
        withCredentials: true
      })
      .then(response => {
        setPosts(response.data.posts);
        setOffers(response.data.offers);
      })
      .catch(error => {
        console.error('Error fetching offers:', error);
      });
    }
  }, [authToken, csrfToken]);

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
  useEffect(() => {
    // ดึง CSRF Token ก่อน
    axios.get('http://localhost:8000/csrf-token', { withCredentials: true })
      .then(response => {
        const csrfToken = response.data.csrf_token;
        setCsrfToken(csrfToken);
        
        // ดึงข้อมูลวัตถุดิบ
        axios.get('http://localhost:8000/api/ingredients', {
          headers: { 'X-CSRF-TOKEN': csrfToken },
          withCredentials: true
        })
        .then(response => {
          setIngredients(response.data.ingredients);
        })
        .catch(error => console.error("Error fetching ingredients:", error));
      })
      .catch(error => console.error("Error fetching CSRF Token:", error));
  }, []);

  useEffect(() => {
    // ดึงข้อมูลโพสต์จาก API
    axios.get('http://localhost:8000/api/buy-posts', { withCredentials: true })
      .then(response => {
        setPosts(response.data.buy_posts);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePost = async () => {
    if ( !form.price_per_unit || !form.unit || !form.amount || !form.description || !form.ingredients_id) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const newPost = {
      ingredients_id: form.ingredients_id,
      description: form.description,
      price_per_unit: form.price_per_unit,
      amount: form.amount,
      unit: form.unit,
      status: 'active',
      shops_shop_id: 1,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/buy-posts', newPost, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        withCredentials: true
      });
      alert("โพสต์สำเร็จ!");
      setPosts([...posts, response.data.buy_post]);
      setForm({ name: "", price_per_unit: 0, unit: "", amount: 0, description: "", ingredients_id: "" });
    } catch (error) {
      console.error('Error posting:', error);
      alert("เกิดข้อผิดพลาดในการสร้างโพสต์");
    }
  };

  const handleEdit = (post: Post) => {
    setEditForm(post);
    setShowPopup(true);
  };
  
  
  const handleCancel = (id: string) => {
    // เปลี่ยนสถานะโพสต์เป็น 'complete' แทนการลบ
    axios.put(`http://localhost:8000/api/buy-posts/${id}`, { status: 'complete' }, {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json',
      },
      withCredentials: true
    })
    .then(() => {
      // อัปเดตโพสต์ที่เปลี่ยนสถานะเป็น 'complete'
      setPosts(posts.map(post => post.post_id === id ? { ...post, status: 'complete' } : post));
      alert("โพสต์นี้ถูกเปลี่ยนสถานะเป็น complete");
    })
    .catch((error) => {
      console.error('Error updating status:', error);
      alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะโพสต์");
    });
  };
  
  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    const updatedForm = {
      ...editForm,
      price_per_unit: Number(editForm.price_per_unit),
      amount: Number(editForm.amount),
    };
  
    axios.put(`http://localhost:8000/api/buy-posts/${editForm.post_id}`, updatedForm, {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json',
      },
      withCredentials: true
    })
    .then(() => {
      alert('แก้ไขโพสต์สำเร็จ');
      setPosts(posts.map(post => post.post_id === editForm.post_id ? { ...editForm, ...updatedForm } : post));
      setShowPopup(false);
    })
    .catch((error) => {
      console.error('Error updating post:', error);
      alert("เกิดข้อผิดพลาดในการอัปเดตโพสต์");
    });
  };

  

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <SideBarShop />
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">สร้างโพสต์</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-1000 font-medium">เลือกวัตถุดิบ</label>
                <select
                  name="ingredients_id"
                  onChange={handleChange}
                  value={form.ingredients_id}
                  className="w-full p-2 border rounded bg-gray-100"
                >
                  <option value="">เลือกวัตถุดิบ</option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.ingredient_id} value={ingredient.ingredient_id}>
                      {ingredient.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-1000 font-medium">ราคา(บาท) ต่อหน่วย</label>
                <input
                  name="price_per_unit"
                  placeholder="ใส่ราคา (บาท)"
                  className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                  type="number"
                  min="0"
                  step="0.5"
                  onChange={handleChange}
                  value={form.price_per_unit}
                />
              </div>
              <div>
                <label className="block text-gray-1000 font-medium">หน่วย</label>
                <input
                  name="unit"
                  placeholder="ใส่หน่วย (kg, g หรืออื่นๆ)"
                  className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                  onChange={handleChange}
                  value={form.unit}
                />
              </div>
              <div>
                <label className="block text-gray-1000 font-medium">ปริมาณ</label>
                <input
                  name="amount"
                  placeholder="ใส่ปริมาณ"
                  className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                  type="number"
                  min="0"
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
                {offers.map((offer) => (
                  <div key={offer.offer_id} className="bg-white p-4 shadow-md rounded-lg border border-gray-200 relative">
                    <h3 className="text-lg font-semibold">{offer.farm?.farm_name || "ไม่มีชื่อฟาร์ม"}</h3>
                    <p>ราคา: {offer.price_per_unit} บาท ต่อ {offer.unit}</p>
                    <p>ปริมาณที่เสนอ: {offer.quantity} {offer.unit}</p>
                    <p>สถานะ: {offer.status}</p>
                    <button className="bg-green-500 text-white py-2 px-4 rounded mt-2">รับซื้อ</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* ฟอร์มการแก้ไขโพสต์ (popup) */}
        {showPopup && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">แก้ไขโพสต์</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-1000 font-medium">เลือกวัตถุดิบ</label>
                  <select
                    name="ingredients_id"
                    onChange={(e) => setEditForm({ ...editForm, ingredients_id: e.target.value })}
                    value={editForm.ingredients_id}
                    className="w-full p-2 border rounded bg-gray-100"
                  >
                    <option value="">เลือกวัตถุดิบ</option>
                    {ingredients.map((ingredient) => (
                      <option key={ingredient.ingredient_id} value={ingredient.ingredient_id}>
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-1000 font-medium">ราคา(บาท) ต่อหน่วย</label>
                  <input
                    name="price_per_unit"
                    type="number"
                    value={editForm.price_per_unit}
                    onChange={(e) => setEditForm({ ...editForm, price_per_unit: e.target.value })}
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-1000 font-medium">หน่วย</label>
                  <input
                    name="unit"
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-1000 font-medium">ปริมาณ</label>
                  <input
                    name="amount"
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-1000 font-medium">รายละเอียด</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                >
                  บันทึกการแก้ไข
                </button>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
    
  );
};

export default ShopPost;
