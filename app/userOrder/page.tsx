"use client";
import { useState } from 'react';
import { Search, ShoppingCart, Bell, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

interface Order {
  id: number;
  shop: string;
  productName: string;
  description: string;
  totalPrice: string;
  type: string | null;
  image?: string;
}

export default function UserOrder() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample order data with state management
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, shop: 'Shop1', productName: 'Product Name', description: 'Description', totalPrice: '฿500', type: null },
    { id: 2, shop: 'Shop2', productName: 'Custom Product', description: 'Custom Description', totalPrice: '฿750', type: 'Custom' },
  ]);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.shop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle opening dialog for new order
  const handleAddOrder = () => {
    setCurrentOrder({
      id: Date.now(),
      shop: '',
      productName: '',
      description: '',
      totalPrice: '',
      type: null
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  // Handle opening dialog for editing
  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Handle deleting order
  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return;

    setIsLoading(true);
    try {
      // In a real app, you would make an API call here
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast("ลบรายการสำเร็จ");
    } catch (error) {
      toast("เกิดข้อผิดพลาดในการลบรายการ");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving order (create/update)
  const handleSaveOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentOrder) return;

    setIsLoading(true);
    try {
      if (isEditing) {
        // Update existing order
        setOrders(prev => prev.map(order => 
          order.id === currentOrder.id ? currentOrder : order
        ));
        toast("อัปเดตรายการสำเร็จ");
      } else {
        // Create new order
        setOrders(prev => [...prev, currentOrder]);
        toast("เพิ่มรายการสำเร็จ");
      }
      setIsDialogOpen(false);
      setCurrentOrder(null);
    } catch (error) {
      toast("เกิดข้อผิดพลาดในการบันทึกรายการ");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes in dialog
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentOrder) return;
    const { name, value } = e.target;
    setCurrentOrder(prev => prev ? { ...prev, [name]: value } : null);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <Navbar />

      {/* Search Bar */}
      <div className="flex justify-between items-center mt-6">
        <div className="relative w-full max-w-md mx-auto">
          <Input
            type="text"
            placeholder="ค้นหารายการ..."
            className="w-full px-4 py-2 rounded-full bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
          >
            <Search className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        <div className="flex space-x-6 ml-4">
          <Button 
            variant="outline"
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleAddOrder}
          >
            <Plus className="w-4 h-4" />
            เพิ่มรายการ
          </Button>
          <Button variant="ghost" size="sm" className="p-1">
            <ShoppingCart className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1">
            <Bell className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Order Section */}
      <div className="mt-8">
        <h1 className="text-2xl font-bold text-center mb-6">รายการสั่งซื้อ</h1>
        
        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-500">
              {searchQuery ? "ไม่พบรายการที่ค้นหา" : "ไม่มีรายการสั่งซื้อ"}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                          <Image 
                            src="/profile-placeholder.png"
                            alt="Shop Profile"
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{order.shop}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOrder(order)}
                          disabled={isLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex mt-4">
                      <div className="w-1/3 flex justify-center items-center">
                        <div className="w-24 h-32 bg-gray-100 flex items-center justify-center">
                          <Image 
                            src="/images/product.png"
                            alt="Product"
                            width={60}
                            height={100}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      
                      <div className="w-2/3 pl-4 flex flex-col justify-between">
                        <div>
                          <p className="font-medium">{order.productName}</p>
                          <p className="text-gray-600">{order.description}</p>
                        </div>
                        <p className="text-gray-600">{order.totalPrice}</p>
                        
                        {order.type && (
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded-md ${
                              order.type === 'Custom Tester' 
                                ? 'bg-yellow-200 text-yellow-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.type}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSaveOrder}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="shop">ร้านค้า</Label>
                <Input
                  id="shop"
                  name="shop"
                  value={currentOrder?.shop || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="productName">ชื่อสินค้า</Label>
                <Input
                  id="productName"
                  name="productName"
                  value={currentOrder?.productName || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">รายละเอียด</Label>
                <Input
                  id="description"
                  name="description"
                  value={currentOrder?.description || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="totalPrice">ราคา</Label>
                <Input
                  id="totalPrice"
                  name="totalPrice"
                  value={currentOrder?.totalPrice || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="type">ประเภท (ถ้ามี)</Label>
                <Input
                  id="type"
                  name="type"
                  value={currentOrder?.type || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
  <Button
    type="button"
    variant="outline"
    onClick={() => {
      setIsDialogOpen(false);
      setCurrentOrder(null);
    }}
    disabled={isLoading}
    className="min-w-[100px]"
  >
    ยกเลิก
  </Button>
  <Button
    type="submit"
    disabled={isLoading}
    className="min-w-[100px] bg-blue-600 hover:bg-blue-700 text-white"
  >
    {isLoading ? (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        กำลังบันทึก...
      </div>
    ) : (
      'บันทึก'
    )}
  </Button>
</div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}