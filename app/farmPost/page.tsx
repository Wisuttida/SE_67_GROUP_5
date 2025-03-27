"use client";

import Navbar from '@/components/Navbar';
import { useEffect, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { ChangeEvent } from "react";
import SideBarFarm from '@/components/SideBarFarm';
import axios from 'axios';

interface Ingredient {
  ingredient_id: number;
  name: string;
}

interface SalePost {
  post_id: number;
  description: string;
  status: string;
  price_per_unit: number;
  amount: number;
  sold_amount: number;
  unit: string;
  created_at: string;
  updated_at: string;
  farms_farm_id: number;
  ingredients_ingredient_id: number;
  ingredients: {
    ingredient_id: number;
    name: string;
  };
}

const FarmPost = () => {
  const [salePosts, setSalePosts] = useState<SalePost[]>([]);
  const [activeTab, setActiveTab] = useState("MyPost");
  const [showPopup, setShowPopup] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

// Fetch ingredients from the API
useEffect(() => {
  // ดึง CSRF Token จาก server ก่อน
  axios.get('http://localhost:8000/csrf-token', { withCredentials: true })
    .then(response => {
      const csrfToken = response.data.csrf_token;  // รับค่า csrf_token จาก API

      // ใช้ CSRF Token ในการทำคำขอต่อไป
      axios.get('http://localhost:8000/api/ingredients', {
        headers: {
          'X-CSRF-TOKEN': csrfToken,  // ส่ง CSRF Token ใน header
        },
        withCredentials: true,  // ใช้ cookies ในการยืนยันตัวตน
      })
      .then(response => {
        setIngredients(response.data.ingredients);
      })
      .catch(error => {
        console.error("Error fetching ingredients:", error);
      });
    })
    .catch(error => {
      console.error("Error fetching CSRF Token:", error);
    });
}, []);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sales-posts`, { withCredentials: true })
      .then(response => {
        const updatedSalePosts = response.data.sales_posts.map((post: SalePost) => ({
          ...post,
          price_per_unit: Number(post.price_per_unit),
          amount: Number(post.amount),
          sold_amount: Number(post.sold_amount),
        }));

        setSalePosts(updatedSalePosts);
      })
      .catch(error => {
        console.error("Error fetching sales posts:", error);
      });

    const fetchData = async () => {
      try {
        const [csrfResponse] = await Promise.all([axios.get(`http://localhost:8000/csrf-token`, { withCredentials: true })]);
        setCsrfToken(csrfResponse.data.csrf_token);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


  const [form, setForm] = useState({
    ingredient_id: 0, // Changed to store the ingredient_id
    price_per_unit: 0,
    unit: "",
    amount: 0,
    description: "",
  });

  const [editForm, setEditForm] = useState<SalePost>({
    post_id: 0,
    ingredients: {
      name: '',
      ingredient_id: 0
    }, //เปลี่ยนเป็น ค่า id ของ ingredient
    price_per_unit: 0,
    unit: "",
    amount: 0,
    description: "",
    sold_amount: 0,
    status: "active",
    farms_farm_id: 1,
    ingredients_ingredient_id: 0,
    created_at: "",
    updated_at: ""
  });


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const updatedForm = {
      ...editForm,
      price_per_unit: Number(editForm.price_per_unit),
      amount: Number(editForm.amount),
    };

    setSalePosts(prevPosts =>
      prevPosts.map(post =>
        post.post_id === updatedForm.post_id ? { ...post, ...updatedForm } : post
      )
    );

    setShowPopup(false);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handlePost = async () => {
    if (!form.ingredient_id || form.ingredient_id === 0) {
      alert("กรุณาเลือกวัตถุดิบ");
      return;
    }
    if (!form.price_per_unit || !form.unit || !form.amount || !form.description) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  
    const requestData = {
      ingredients_id: form.ingredient_id,
      description: form.description,
      price_per_unit: form.price_per_unit,
      amount: form.amount,
      unit: form.unit,
    };
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/sales-posts`,
        requestData,
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      alert("โพสต์สำเร็จ!");
    } catch (error: any) {
      console.error("Error posting sale:", error.response ? error.response.data : error.message);
      alert("เกิดข้อผิดพลาดในการสร้างโพสต์");
    }
  };
  
  

  const handleEdit = (post: SalePost) => {
    setEditForm({ ...post });
    setShowPopup(true);
  };

  const handleCancel = (id: number) => {
    setSalePosts(salePosts.filter(post => post.post_id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <div><SideBarFarm /></div>
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">สร้างโพสต์</h2>
            <form className="space-y-4">
            <div>
  <label className="block text-gray-1000 font-medium">เลือกวัตถุดิบ</label>
  <select
  name="ingredient_id"
  className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
  onChange={handleChange}
  value={form.ingredient_id}  // Use ingredient_id here
>
  <option value="">กรุณาเลือกวัตถุดิบ</option>
  {ingredients.map(ingredient => (
    <option key={ingredient.ingredient_id} value={ingredient.ingredient_id}>
      {ingredient.name}
    </option>
  ))}
</select>

</div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-1000 font-medium">ราคา(บาท) ต่อหน่วย</label>
                  <input
                    name="price_per_unit"
                    placeholder="ใส่ราคา (บาท)"
                    className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                    type="number"
                    min="0"
                    step="1"
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
              </div>
              <div>
                <label className="block text-gray-1000 font-medium">ปริมาณ</label>
                <input
                  name="amount"
                  placeholder="ใส่ปริมาณ"
                  className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
                  type="number"
                  min="0"
                  step="1"
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
                {salePosts.map((post) => (
                  <div key={post.post_id} className="bg-gray-50 p-4 shadow-md rounded-lg border border-gray-200 relative">
                    <div className="absolute top-2 right-2 cursor-pointer group">
                      <FiMoreVertical className="text-gray-600" />
                      <div className="hidden group-hover:block absolute right-0 bg-white shadow-md rounded-lg p-2">
                        <button onClick={() => handleEdit(post)} className="text-blue-500">แก้ไข</button>
                        <button onClick={() => handleCancel(post.post_id)} className="text-red-500">ลบ</button>
                      </div>
                    </div>
                    <h3 className="font-bold">{post.ingredients.name}</h3>
                    <p>{post.description}</p>
                    <p className="mt-2">ราคา: {post.price_per_unit} บาท/{post.unit}</p>
                    <p>จำนวน: {post.amount} {post.unit}</p>
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
  <label className="block text-gray-1000 font-medium">เลือกวัตถุดิบ</label>
  <select
  name="ingredient_id"
  className="w-full p-2 border rounded bg-gray-100 placeholder-gray-600"
  onChange={handleChange}
  value={form.ingredient_id}  // Use ingredient_id here
>
  <option value="">กรุณาเลือกวัตถุดิบ</option>
  {ingredients.map(ingredient => (
    <option key={ingredient.ingredient_id} value={ingredient.ingredient_id}>
      {ingredient.name}
    </option>
  ))}
</select>

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
