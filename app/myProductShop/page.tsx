"use client";
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from "axios";
import SideBarShop from '@/components/SideBarShop';

interface Product {
  product_id: number;
  name: string;
  price: number;
  image_url: string | null;
  image: string;
  stock_quantity: number;
  volume: number;
  gender_target: string;
  fragrance_strength: string;
  shopName: string;
  shopImage: string;
  description: string;
  shops_shop_id: number
}

export default function MyProductShop() {
  const csrf = localStorage.getItem('csrfToken');
  const token = localStorage.getItem('token');

  const [products, setProducts] = useState<Product[]>([]);
  const [shopId, setShopId] = useState();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState({
    price: '',
    strengths: '',
    gender: '',
  });
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("ข้อมูลที่ได้รับไม่ใช่ Array:", response.data);
        }
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
      const shop_dataGet = localStorage.getItem('shop');
      if (shop_dataGet) {
        try {
          const data = JSON.parse(shop_dataGet);
          setShopId(data.shop_id);
        } catch (error) {
          console.error('Error parsing shop data from localStorage:', error);
        }
      }
    }, []);
  const handleUpdate = (id: number, key: string, value: string | number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.product_id === id ? { ...product, [key]: value } : product
      )
    );
  };

  const handleEdit = (id: number) => {
    setEditingId(id); // เมื่อคลิก edit ให้ตั้งค่ารหัสของสินค้าในโหมดแก้ไข
  };

  const handleSave = () => {
    setEditingId(null); // เมื่อบันทึกให้กลับไปโหมดแสดงข้อมูล
  };

  const handleRemove = async (id: number) => {
    const confirmRemove = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?");
    if (!confirmRemove) return;

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
        ,{headers:{

        'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrf,
      },
        withCredentials: true});
      if (response.status === 200) {
        // ลบสินค้าที่ถูกลบออกจาก state
        setProducts((prev) => prev.filter((product) => product.product_id !== id));
        alert("ลบสินค้าสำเร็จ");
      } else {
        console.error("Unexpected response:", response.data);
        alert("เกิดข้อผิดพลาดในการลบสินค้า");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("ไม่สามารถลบสินค้าได้");
    }
  };

  const handleImageUpload = (id: number, file: File) => {
    const imageUrl = URL.createObjectURL(file);
    handleUpdate(id, 'image', imageUrl); // อัพเดตภาพที่เลือก
  };

  const filteredProducts = products
    .filter((product) => product.shops_shop_id === shopId)
    .filter((product) => !filter.strengths || product.fragrance_strength=== filter.strengths)
    .filter((product) => !filter.gender || product.gender_target === filter.gender)
    .sort((a, b) => {
      if (filter.price === 'asc') return a.price - b.price;
      if (filter.price === 'desc') return b.price - a.price;
      return 0;
    });
  const keyMapping: { [key in keyof Product]?: string } = {
    name: 'ชื่อสินค้า',
    price: 'ราคา',
    gender_target: 'สำหรับ',
    volume: 'ปริมาตร',
    stock_quantity: 'จำนวนสินค้า',
    fragrance_strength: 'ความเข้มข้น',
    description: 'รายละเอียด',
  };
  const keyOrder: (keyof Product)[] = [
    'name',
    'price',
    'volume',
    'gender_target',
    'fragrance_strength',
    'description',
    'stock_quantity',
  ];
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
              <div key={product.product_id} className="border rounded-lg p-4 shadow-sm bg-white">
                <Image
                  src={product.image_url || "/path/to/default-image.jpg"}
                  alt={product.name}
                  width={500}
                  height={300}
                  layout="responsive"
                  className="rounded-lg"
                />
                {editingId === product.product_id ? (
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
                            handleImageUpload(product.product_id, file); // อัพโหลดรูปภาพใหม่
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
                            onChange={(e) => handleUpdate(product.product_id, key, e.target.value)}
                            className="border p-2 w-full"
                          />
                        </div>
                      )
                    ))}

                    {/* Edit strengths */}
                    <div>
                      <label className="block capitalize">Strengths</label>
                      <select
                        value={product.fragrance_strength}
                        onChange={(e) => handleUpdate(product.product_id, 'strengths', e.target.value)}
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
                        value={product.gender_target}
                        onChange={(e) => handleUpdate(product.product_id, 'gender', e.target.value)}
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
                        onChange={(e) => handleUpdate(product.product_id, 'description', e.target.value)}
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
                    {keyOrder.map((key) => (
                      key !== 'product_id' && key !== 'image_url' && key !== 'shops_shop_id' &&  (
                        <p key={key}><strong>{keyMapping[key as keyof Product]} :</strong> {product[key]}</p>
                      )
                    ))}
                    <button onClick={() => handleEdit(product.product_id)} className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-100 w-full">✏️ Edit</button>
                    <button onClick={() => handleRemove(product.product_id)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full">🗑️ Remove</button>
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
