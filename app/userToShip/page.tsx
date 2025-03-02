"use client";
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, Trash, Truck, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import * as badge from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

interface Shop {
  id: string;
  name: string;
  avatar: string;
}

interface ShippingOrder {
  id: string;
  shop: Shop;
  product: Product;
  orderDate: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingMethod?: string;
}

export default function UserToShip() {
  // สร้าง state สำหรับเก็บข้อมูลรายการที่ต้องจัดส่ง
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ShippingOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Dialog state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState<ShippingOrder | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');

  // ฟังก์ชันเพื่อดึงข้อมูลรายการที่ต้องจัดส่ง
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // ในสถานการณ์จริง จะต้องเรียก API เพื่อดึงข้อมูล
        // ตัวอย่าง: const response = await fetch('/api/orders/to-ship');
        // const data = await response.json();
        
        // จำลองการดึงข้อมูล
        const mockOrders: ShippingOrder[] = Array(6).fill(null).map((_, index) => ({
          id: `order-${index + 1}`,
          shop: {
            id: `shop-${index + 1}`,
            name: `Shop ${index + 1}`,
            avatar: "/avatar.png"
          },
          product: {
            id: `product-${index + 1}`,
            name: `สินค้า ${index + 1}`,
            description: `คำอธิบายสินค้า ${index + 1}`,
            price: 500 + (index * 100),
            quantity: 1 + index,
            image: "/product.png"
          },
          orderDate: new Date(2025, 2, 1 - index).toISOString(),
          status: index % 2 === 0 ? 'pending' : (index % 3 === 0 ? 'shipped' : 'pending')
        }));
        
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          variant: "destructive",
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถดึงข้อมูลรายการสินค้าที่ต้องจัดส่งได้"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // ฟังก์ชันการค้นหาและการกรอง
  useEffect(() => {
    let result = [...orders];
    
    // กรองตามแท็บที่เลือก
    if (activeTab !== 'all') {
      result = result.filter(order => order.status === activeTab);
    }
    
    // กรองตามคำค้นหา
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.product.name.toLowerCase().includes(query) ||
        order.shop.name.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
      );
    }
    
    setFilteredOrders(result);
  }, [orders, searchQuery, activeTab]);
  
  // ฟังก์ชันเลือกหรือยกเลิกการเลือกคำสั่งซื้อ
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };
  
  // ฟังก์ชันเลือกทั้งหมด
  const selectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };
  
  // ฟังก์ชันอัปเดตสถานะเป็น "จัดส่งแล้ว"
  const markAsShipped = async () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "โปรดเลือกรายการ",
        description: "กรุณาเลือกรายการที่ต้องการทำเครื่องหมายว่าจัดส่งแล้ว",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // ในสถานการณ์จริง จะต้องเรียก API เพื่ออัปเดตสถานะ
      // ตัวอย่าง: await fetch('/api/orders/update-status', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ orderIds: selectedOrders, status: 'shipped' })
      // });
      
      // จำลองการอัปเดตสถานะ
      console.log("Marking orders as shipped:", selectedOrders);
      
      // อัปเดต state
      setOrders(prev => prev.map(order => 
        selectedOrders.includes(order.id) 
          ? { ...order, status: 'shipped' } 
          : order
      ));
      
      // รีเซ็ตการเลือก
      setSelectedOrders([]);
      
      // แสดงข้อความแจ้งเตือนการอัปเดตสำเร็จ
      toast({
        title: "อัปเดตสำเร็จ",
        description: `ทำเครื่องหมายจัดส่งแล้ว ${selectedOrders.length} รายการ`
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะรายการได้ โปรดลองอีกครั้ง"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // ฟังก์ชันลบรายการที่เลือก
  const deleteSelectedOrders = async () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "โปรดเลือกรายการ",
        description: "กรุณาเลือกรายการที่ต้องการลบ",
        variant: "destructive"
      });
      return;
    }
    
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedOrders.length} รายการที่เลือก?`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      // ในสถานการณ์จริง จะต้องเรียก API เพื่อลบรายการ
      // ตัวอย่าง: await fetch('/api/orders', {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ orderIds: selectedOrders })
      // });
      
      // จำลองการลบรายการ
      console.log("Deleting orders:", selectedOrders);
      
      // อัปเดต state
      setOrders(prev => prev.filter(order => !selectedOrders.includes(order.id)));
      
      // รีเซ็ตการเลือก
      setSelectedOrders([]);
      
      // แสดงข้อความแจ้งเตือนการลบสำเร็จ
      toast({
        title: "ลบสำเร็จ",
        description: `ลบ ${selectedOrders.length} รายการเรียบร้อยแล้ว`
      });
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบรายการได้ โปรดลองอีกครั้ง"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // ฟังก์ชันเปิด dialog สำหรับอัปเดตข้อมูลการจัดส่ง
  const openUpdateDialog = (order: ShippingOrder) => {
    setSelectedOrderForUpdate(order);
    setTrackingNumber(order.trackingNumber || '');
    setShippingMethod(order.shippingMethod || '');
    setUpdateDialogOpen(true);
  };
  
  // ฟังก์ชันบันทึกข้อมูลการจัดส่ง
  const saveShippingDetails = async () => {
    if (!selectedOrderForUpdate) return;
    
    setIsLoading(true);
    try {
      // ในสถานการณ์จริง จะต้องเรียก API เพื่ออัปเดตข้อมูลการจัดส่ง
      // ตัวอย่าง: await fetch(`/api/orders/${selectedOrderForUpdate.id}/shipping`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ trackingNumber, shippingMethod, status: 'shipped' })
      // });
      
      // จำลองการอัปเดตข้อมูล
      console.log("Updating shipping details:", {
        orderId: selectedOrderForUpdate.id,
        trackingNumber,
        shippingMethod
      });
      
      // อัปเดต state
      setOrders(prev => prev.map(order => 
        order.id === selectedOrderForUpdate.id 
          ? { 
              ...order, 
              trackingNumber, 
              shippingMethod, 
              status: 'shipped' 
            } 
          : order
      ));
      
      // ปิด dialog
      setUpdateDialogOpen(false);
      setSelectedOrderForUpdate(null);
      
      // แสดงข้อความแจ้งเตือนการอัปเดตสำเร็จ
      toast({
        title: "อัปเดตสำเร็จ",
        description: "บันทึกข้อมูลการจัดส่งเรียบร้อยแล้ว"
      });
    } catch (error) {
      console.error("Error updating shipping details:", error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลการจัดส่งได้ โปรดลองอีกครั้ง"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-12">
        <Navbar />
      <div className="flex justify-center py-4">
        <h2 className="text-2xl font-bold">รายการที่ต้องจัดส่ง</h2>
      </div>
      
      {/* ส่วนค้นหาและกรอง */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="ค้นหารายการ..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={selectAllOrders}
            >
              <Checkbox 
                checked={selectedOrders.length > 0 && selectedOrders.length === filteredOrders.length} 
                className="mr-1"
              />
              เลือกทั้งหมด
            </Button>
            <Button 
              variant="destructive" 
              className="flex items-center gap-1"
              onClick={deleteSelectedOrders}
              disabled={selectedOrders.length === 0 || isLoading}
            >
              <Trash size={16} />
              ลบที่เลือก
            </Button>
            <Button 
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={markAsShipped}
              disabled={selectedOrders.length === 0 || isLoading}
            >
              <Truck size={16} />
              ทำเครื่องหมายว่าจัดส่งแล้ว
            </Button>
          </div>
        </div>
      </div>
      
      {/* แท็บสถานะ */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-4">
          <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
          <TabsTrigger value="pending">รอจัดส่ง</TabsTrigger>
          <TabsTrigger value="shipped">จัดส่งแล้ว</TabsTrigger>
          <TabsTrigger value="delivered">จัดส่งถึงแล้ว</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading && filteredOrders.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl text-gray-500">ไม่พบรายการที่ต้องจัดส่ง</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox 
                      checked={selectedOrders.includes(order.id)} 
                      onCheckedChange={() => toggleOrderSelection(order.id)}
                      className="mr-3"
                    />
                    <Image
                      src={order.shop.avatar}
                      alt={order.shop.name}
                      width={40}
                      height={40}
                      className="rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">{order.shop.name}</p>
                      <p className="text-sm text-gray-500">รหัสคำสั่งซื้อ: {order.id}</p>
                    </div>
                  </div>
                  <badge.Badge 
                    className={`
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                    `}
                  >
                    {order.status === 'pending' ? 'รอจัดส่ง' : 
                     order.status === 'shipped' ? 'จัดส่งแล้ว' : 
                     'จัดส่งถึงแล้ว'}
                  </badge.Badge>
                </div>
                <div className="p-4 flex items-center">
                  <Image
                    src={order.product.image}
                    alt={order.product.name}
                    width={80}
                    height={80}
                    className="mr-4"
                  />
                  <div className="flex-grow">
                    <p className="font-medium">{order.product.name}</p>
                    <p className="text-gray-600 text-sm">{order.product.description}</p>
                    <p className="text-gray-600 text-sm">จำนวน: {order.product.quantity} ชิ้น</p>
                    <p className="font-semibold">฿{(order.product.price * order.product.quantity).toLocaleString()}</p>
                  </div>
                </div>
                {order.trackingNumber && (
                  <div className="px-4 pb-2">
                    <p className="text-sm text-gray-600">เลขพัสดุ: {order.trackingNumber}</p>
                    <p className="text-sm text-gray-600">วิธีจัดส่ง: {order.shippingMethod}</p>
                  </div>
                )}
                <div className="p-4 bg-gray-50 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 border-blue-600"
                    onClick={() => openUpdateDialog(order)}
                  >
                    อัปเดตข้อมูลจัดส่ง
                  </Button>
                  <Button 
                    variant={order.status === 'pending' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => {
                      if (order.status === 'pending') {
                        openUpdateDialog(order);
                      } else {
                        window.open(`https://example.com/tracking/${order.trackingNumber}`, '_blank');
                      }
                    }}
                    className={order.status === 'pending' ? "bg-blue-600 text-white" : "text-gray-600"}
                  >
                    {order.status === 'pending' ? 'ทำเครื่องหมายว่าจัดส่งแล้ว' : 'ติดตามพัสดุ'}
                    {order.status !== 'pending' && <ExternalLink size={14} className="ml-1" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Dialog สำหรับอัปเดตข้อมูลการจัดส่ง */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>อัปเดตข้อมูลการจัดส่ง</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลการจัดส่งสำหรับคำสั่งซื้อ {selectedOrderForUpdate?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">วิธีจัดส่ง</label>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกวิธีจัดส่ง" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thaipost">ไปรษณีย์ไทย</SelectItem>
                  <SelectItem value="flash">Flash Express</SelectItem>
                  <SelectItem value="kerry">Kerry Express</SelectItem>
                  <SelectItem value="j&t">J&T Express</SelectItem>
                  <SelectItem value="lalamove">Lalamove</SelectItem>
                  <SelectItem value="grab">Grab Express</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">เลขพัสดุ</label>
              <Input 
                placeholder="กรอกเลขพัสดุ" 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>ยกเลิก</Button>
            <Button 
              onClick={saveShippingDetails}
              disabled={!shippingMethod || !trackingNumber || isLoading}
            >
              {isLoading ? 
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                  กำลังบันทึก...
                </span> : 
                "บันทึกและทำเครื่องหมายว่าจัดส่งแล้ว"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}