"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import axios from 'axios';
import LoadingPage from '@/components/LoadingPage';

// Default images for fallback
const DEFAULT_IMAGES = {
  profile: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Cpath d='M20 20C22.7614 20 25 17.7614 25 15C25 12.2386 22.7614 10 20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20ZM20 22C16.6863 22 14 24.6863 14 28H26C26 24.6863 23.3137 22 20 22Z' fill='%239ca3af'/%3E%3C/svg%3E",
  product: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='100' viewBox='0 0 60 100'%3E%3Crect width='60' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3EProduct%3C/text%3E%3C/svg%3E",
  qr: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='24'%3EQR Code%3C/text%3E%3C/svg%3E"
};

type PaymentParams = {
  id: string;
};

interface Shop {
  shop_id: number;
  shop_name: string;
  shop_image: string | null;
  description: string;
  accepts_custom: number;
  bank_name: string;
  bank_account: string;
  bank_number: string;
  is_activate: number;
  users_user_id: number;
  addresses_address_id: number;
}

interface Product {
  product_id: number;
  name: string;
  description: string | null;
  price: string;
  volume: number;
  stock_quantity: number;
  image_url: string;
  gender_target: string;
  fragrance_strength: string;
  status: string;
  created_at: string;
  updated_at: string;
  shops_shop_id: number;
  shop: Shop;
}

interface OrderItem {
  order_item_id: number;
  quantity: number;
  price: string;
  created_at: string;
  updated_at: string;
  products_product_id: number;
  orders_order_id: number;
  product: Product;
}

interface Order {
  order_id: number;
  total_amount: string;
  status: string;
  created_at: string;
  updated_at: string;
  addresses_address_id: number;
  shops_shop_id: number;
  users_user_id: number;
  order_items: OrderItem[];
}
type OrdersResponse = Order[];

interface AddressInfo {
  address_id: string;
  fname: string;
  lname: string;
  phonenumber: string;
  street_name: string;
  building: string;
  subDistrict: string;
  district: string;
  province: string;
  zipcode: string;
  house_number: string;
  is_default: boolean;
  position_id: string;
}

export default function Payment() {
  const params = useParams() as PaymentParams;
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [orders, setOrders] = useState<OrdersResponse>([]);
  const [selectedOrders, setSelectedOrders] = useState<OrderItem[]>([]);
  const [addressInfo, setAddressInfo] = useState<AddressInfo>();
  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAddress = async (addressId: number) => {
      try {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressId}`, {})
        .then(res => {
          setAddressInfo(res.data.data[0]);
        })
        .catch(error => {
          console.error("Error fetching address:", error);
        });
      } catch (error) {
        toast("ไม่สามารถเรียกที่อยู่ได้ กรุณาลองใหม่อีกครั้ง");
      }
    }
    const fetchPaymentData = async () => {
      let addressId = 0;
      try {
        setIsLoading(true);

        // Validate that we have an ID
        if (!params?.id) {
            toast("ไม่พบข้อมูลการชำระเงิน");
            router.push('/userToPay');
            return;
          }

        // Simulated data fetch with delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const storedOrders = localStorage.getItem('ordersPending');
        if (storedOrders) {
            const parsedOrders = JSON.parse(storedOrders);
            setOrders(parsedOrders);

            // Filter the order items that match the ID
            const matchingOrders = parsedOrders.flatMap((order:Order) => 
                order.order_items.filter((item: OrderItem) => item.order_item_id === Number(params?.id))
            );
            setSelectedOrders(matchingOrders);

            const firstOrder = parsedOrders.find((order:Order) => order.order_items.some((item: OrderItem) => item.order_item_id === Number(params?.id)));
            if (firstOrder) {
                addressId = firstOrder.addresses_address_id;
            }
        } else {
            console.log("No orders found in localStorage."); // Log if no orders are found
        }
      } catch (error) {
        toast("ไม่สามารถโหลดข้อมูลการชำระเงินได้");
        router.push('/userToPay');
      } finally {
        fetchAddress(addressId);
      }
    };
    
    fetchPaymentData();
    
    return () => {
      setSelectedFile(null);
      setShowProofDialog(false);
    };
  }, [params?.id, router, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUploadProof = async () => {
    if (!selectedFile) {
        toast("กรุณาเลือกไฟล์หลักฐานการโอนก่อนอัพโหลด");
        return;
      }

    setIsLoading(true);
    try {
      // Simulate upload with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast("อัพโหลดหลักฐานการโอนเรียบร้อยแล้ว");

      setShowProofDialog(false);
      setSelectedFile(null);
      
      // Wait a bit before redirecting
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/userOrder');
    } catch (error) {
        toast("ไม่สามารถอัพโหลดหลักฐานการโอนได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
      setIsLoading(false);
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex flex-col">
  //       <Navbar />
  //       <div className="flex-1 flex justify-center items-center">
  //         <div className="flex flex-col items-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  //           <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  useEffect(() => {
    if (addressInfo) {
        setIsLoading(false); // Set loading to false when addressInfo is available
    }
  }, [addressInfo]);

  return (
    <div>
      <Navbar />
        {isLoading ? (
        <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </div>) : (

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-center mb-6">ชำระเงิน</h1>
        {/* Address Section */}
        {selectedOrders.length > 0 ? (
          selectedOrders.map((orderItem) => (
              <div key={orderItem.order_item_id}>
                  {/* Address Section */}
                  <Card className="mb-6">
                      <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-4">
                              <h2 className="text-lg font-semibold">ที่อยู่จัดส่ง</h2>
                              <Button variant="ghost" className="text-blue-600">
                                  <ChevronRight className="h-5 w-5" />
                              </Button>
                          </div>
                          
                          <div className="space-y-2">
                              <p className="font-medium font-semibold">{addressInfo?.fname} {addressInfo?.lname} | {addressInfo?.phonenumber}</p>
                              <p>เลขที่ {addressInfo?.house_number} {addressInfo?.building ? `ตึก ${addressInfo?.building}` : ''} ถนน {addressInfo?.street_name}, ตำบล {addressInfo?.subDistrict}, อำเภอ {addressInfo?.district}, จังหวัด {addressInfo?.province}, {addressInfo?.zipcode} </p>
                          </div>
                      </CardContent>
                  </Card>

                  {/* Shop and Product Section */}
                  <Card className="mb-6">
                      <CardContent className="p-4">
                          <div className="flex items-center mb-4">
                              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                                  <Image 
                                      src={orderItem.product.shop.shop_image}
                                      alt={orderItem.product.shop.shop_name}
                                      width={40}
                                      height={40}
                                      className="object-cover"
                                  />
                              </div>
                              <span className="font-medium">{orderItem.product.shop.shop_name}</span>
                          </div>

                          <div className="flex mb-4">
                              <div className="w-30 h-30 bg-gray-100 flex items-center justify-center">
                                  <Image 
                                      src={orderItem.product.image_url}
                                      alt={orderItem.product.name}
                                      width={300}
                                      height={300}
                                      className="w-full h-full object-cover rounded-lg mb-4"
                                  />
                              </div>
                              
                              <div className="ml-4 flex-grow">
                                  <h3 className="font-medium">{orderItem.product.name}</h3>
                                  <p className="text-gray-600 text-sm">{orderItem.product.description}</p>
                                  <p className="text-sm">จำนวน: {orderItem.quantity} ชิ้น</p>
                                  <p className="font-medium">ราคา: ฿{(parseFloat(orderItem.price) * orderItem.quantity).toLocaleString()}</p>
                                  <p className="text-sm text-gray-600">
                                      วันที่คาดว่าจะได้รับ: {new Date(orderItem.created_at).toLocaleDateString('th-TH')}
                                  </p>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
          

        {/* Payment Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">ข้อมูลการชำระเงิน</h2>
            
            <div className="flex justify-center mb-4">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1200px-QR_Code_Example.svg.png"
                alt="QR Code"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>

            <div className="text-center space-y-2 mb-4">
              <p className="font-medium">{orderItem.product.shop.bank_name}</p>
              <p>{orderItem.product.shop.bank_account}</p>
              <p className="font-medium">฿{(parseFloat(orderItem.price) * orderItem.quantity).toLocaleString()}</p>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2"
              onClick={() => setShowProofDialog(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              อัพโหลดหลักฐานการโอน
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
            ย้อนกลับ
          </Button>
          <Button
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => {
              toast("กรุณาอัพโหลดหลักฐานการโอนก่อนยืนยันการสั่งซื้อ");
              setShowProofDialog(true);
            }}
            disabled={isLoading}
          >
            สั่งซื้อ
          </Button>
        </div>

        {/* Upload Proof Dialog */}
        <Dialog 
        open={showProofDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedFile(null);
          }
          setShowProofDialog(open);
        }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>อัพโหลดหลักฐานการโอน</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="proof-upload"
                />
                <label
                  htmlFor="proof-upload"
                  className="cursor-pointer block p-4"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง
                  </p>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-blue-600">
                      {selectedFile.name}
                    </p>
                  )}
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowProofDialog(false);
                    setSelectedFile(null);
                  }}
                  disabled={isLoading}
                  className="min-w-[100px]"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleUploadProof}
                  disabled={!selectedFile || isLoading}
                  className="min-w-[100px] bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      กำลังอัพโหลด...
                    </div>
                  ) : (
                    'อัพโหลด'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
        ))
        ) : (
            <div className="text-center">ไม่มีข้อมูลการสั่งซื้อ</div> // Message when no selected orders are found
        )}
      </div>
      )}
    </div>
  );
}