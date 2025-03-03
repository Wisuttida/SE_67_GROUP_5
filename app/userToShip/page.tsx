"use client";
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, Trash, Truck, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

// Default images for fallback
const DEFAULT_IMAGES = {
  profile: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Cpath d='M20 20C22.7614 20 25 17.7614 25 15C25 12.2386 22.7614 10 20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20ZM20 22C16.6863 22 14 24.6863 14 28H26C26 24.6863 23.3137 22 20 22Z' fill='%239ca3af'/%3E%3C/svg%3E",
  product: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3EProduct%3C/text%3E%3C/svg%3E"
};

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
  const { toast } = useToast();
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ShippingOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Dialog state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState<ShippingOrder | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const mockOrders: ShippingOrder[] = Array(6).fill(null).map((_, index) => ({
          id: `order-${index + 1}`,
          shop: {
            id: `shop-${index + 1}`,
            name: `Shop ${index + 1}`,
            avatar: DEFAULT_IMAGES.profile
          },
          product: {
            id: `product-${index + 1}`,
            name: `สินค้า ${index + 1}`,
            description: `คำอธิบายสินค้า ${index + 1}`,
            price: 500 + (index * 100),
            quantity: 1 + index,
            image: DEFAULT_IMAGES.product
          },
          orderDate: new Date(2025, 2, 1 - index).toISOString(),
          status: index % 2 === 0 ? 'pending' : (index % 3 === 0 ? 'shipped' : 'pending')
        }));
        
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      } catch (error) {
        toast("ไม่สามารถดึงข้อมูลรายการสินค้าที่ต้องจัดส่งได้");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [toast]);
  
  useEffect(() => {
    let result = [...orders];
    
    if (activeTab !== 'all') {
      result = result.filter(order => order.status === activeTab);
    }
    
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
  
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };
  
  const selectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };
  
  const markAsShipped = async () => {
    if (selectedOrders.length === 0) {
      toast("กรุณาเลือกรายการที่ต้องการทำเครื่องหมายว่าจัดส่งแล้ว");
      return;
    }
    
    setIsLoading(true);
    try {
      setOrders(prev => prev.map(order => 
        selectedOrders.includes(order.id) 
          ? { ...order, status: 'shipped' } 
          : order
      ));
      
      setSelectedOrders([]);
      toast(`ทำเครื่องหมายจัดส่งแล้ว ${selectedOrders.length} รายการ`);
    } catch (error) {
      toast("ไม่สามารถอัปเดตสถานะรายการได้ โปรดลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteSelectedOrders = async () => {
    if (selectedOrders.length === 0) {
      toast("กรุณาเลือกรายการที่ต้องการลบ");
      return;
    }
    
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedOrders.length} รายการที่เลือก?`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      setOrders(prev => prev.filter(order => !selectedOrders.includes(order.id)));
      setSelectedOrders([]);
      toast(`ลบ ${selectedOrders.length} รายการเรียบร้อยแล้ว`);
    } catch (error) {
      toast("ไม่สามารถลบรายการได้ โปรดลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };
  
  const openUpdateDialog = (order: ShippingOrder) => {
    setSelectedOrderForUpdate(order);
    setTrackingNumber(order.trackingNumber || '');
    setShippingMethod(order.shippingMethod || '');
    setUpdateDialogOpen(true);
  };
  
  const saveShippingDetails = async () => {
    if (!selectedOrderForUpdate) return;
    
    setIsLoading(true);
    try {
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
      
      setUpdateDialogOpen(false);
      setSelectedOrderForUpdate(null);
      toast("บันทึกข้อมูลการจัดส่งเรียบร้อยแล้ว");
    } catch (error) {
      toast("ไม่สามารถบันทึกข้อมูลการจัดส่งได้ โปรดลองอีกครั้ง");
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
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={selectAllOrders}
            >
              <Checkbox 
                checked={selectedOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                className="mr-1"
                onCheckedChange={selectAllOrders}
              />
              <span>เลือกทั้งหมด</span>
            </div>
            
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
      
      <div className="mb-6">
        <TabsList>
          <TabsTrigger
            label="ทั้งหมด"
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          />
          <TabsTrigger
            label="รอจัดส่ง"
            active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
          />
          <TabsTrigger
            label="จัดส่งแล้ว"
            active={activeTab === 'shipped'}
            onClick={() => setActiveTab('shipped')}
          />
          <TabsTrigger
            label="จัดส่งถึงแล้ว"
            active={activeTab === 'delivered'}
            onClick={() => setActiveTab('delivered')}
          />
        </TabsList>
      </div>
      
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
                  <Badge 
                    className={`
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                    `}
                  >
                    {order.status === 'pending' ? 'รอจัดส่ง' : 
                     order.status === 'shipped' ? 'จัดส่งแล้ว' : 
                     'จัดส่งถึงแล้ว'}
                  </Badge>
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
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                <option value="">เลือกวิธีจัดส่ง</option>
                <option value="thaipost">ไปรษณีย์ไทย</option>
                <option value="flash">Flash Express</option>
                <option value="kerry">Kerry Express</option>
                <option value="j&t">J&T Express</option>
                <option value="lalamove">Lalamove</option>
                <option value="grab">Grab Express</option>
              </select>
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