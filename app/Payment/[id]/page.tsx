"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import Navbar from "@/components/Navbar";

interface Address {
  name: string;
  phoneNumber: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  streetName: string;
  building: string;
  houseNo: string;
}

interface Shop {
  id: string;
  name: string;
  avatar: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  amount: number;
  price: number;
  image: string;
  estimatedDate: string;
}

interface PaymentData {
  address: Address;
  shop: Shop;
  product: Product;
  bankName: string;
  accountName: string;
  qrCode: string;
}

export default function Payment() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    // Simulated data fetch
    const mockPaymentData: PaymentData = {
      address: {
        name: "John Doe",
        phoneNumber: "0891234567",
        province: "กรุงเทพมหานคร",
        district: "วัฒนา",
        subDistrict: "คลองตันเหนือ",
        postalCode: "10110",
        streetName: "สุขุมวิท",
        building: "อาคาร A",
        houseNo: "123/45"
      },
      shop: {
        id: "shop1",
        name: "Shop1",
        avatar: "/profile-placeholder.png"
      },
      product: {
        id: "prod1",
        name: "Product Name",
        description: "Description",
        amount: 1,
        price: 500,
        image: "/product-placeholder.png",
        estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      bankName: "ธนาคารกสิกรไทย",
      accountName: "บริษัท ชอปปิ้ง จำกัด",
      qrCode: "/qr-placeholder.png"
    };

    setPaymentData(mockPaymentData);
  }, [params.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadProof = async () => {
    if (!selectedFile) {
      toast("กรุณาเลือกไฟล์หลักฐานการโอน");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast("อัพโหลดหลักฐานการโอนเรียบร้อยแล้ว");
      setShowProofDialog(false);
      setSelectedFile(null);
      router.push('/userOrder');
    } catch (error) {
      toast("เกิดข้อผิดพลาดในการอัพโหลดหลักฐาน");
    } finally {
      setIsLoading(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <Navbar />

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-center mb-6">ชำระเงิน</h1>

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
              <p className="font-medium">{paymentData.address.name}</p>
              <p>{paymentData.address.phoneNumber}</p>
              <p>{paymentData.address.building} {paymentData.address.houseNo}</p>
              <p>{paymentData.address.streetName} {paymentData.address.subDistrict}</p>
              <p>
                {paymentData.address.district} {paymentData.address.province}{' '}
                {paymentData.address.postalCode}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shop and Product Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                <Image 
                  src={paymentData.shop.avatar}
                  alt={paymentData.shop.name}
                  width={40}
                  height={40}
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3E?%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="font-medium">{paymentData.shop.name}</span>
            </div>

            <div className="flex mb-4">
              <div className="w-24 h-32 bg-gray-100 flex items-center justify-center">
                <Image 
                  src={paymentData.product.image}
                  alt={paymentData.product.name}
                  width={60}
                  height={100}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='100' viewBox='0 0 60 100'%3E%3Crect width='60' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3E?%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              
              <div className="ml-4 flex-grow">
                <h3 className="font-medium">{paymentData.product.name}</h3>
                <p className="text-gray-600 text-sm">{paymentData.product.description}</p>
                <p className="text-sm">จำนวน: {paymentData.product.amount} ชิ้น</p>
                <p className="font-medium">ราคา: ฿{paymentData.product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  วันที่คาดว่าจะได้รับ: {new Date(paymentData.product.estimatedDate).toLocaleDateString('th-TH')}
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
                src={paymentData.qrCode}
                alt="QR Code"
                width={200}
                height={200}
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='24'%3EQR Code%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <div className="text-center space-y-2 mb-4">
              <p className="font-medium">{paymentData.bankName}</p>
              <p>{paymentData.accountName}</p>
              <p className="font-medium">฿{paymentData.product.price.toLocaleString()}</p>
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
        <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
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
                  variant="outline"
                  onClick={() => setShowProofDialog(false)}
                  disabled={isLoading}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleUploadProof}
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? 'กำลังอัพโหลด...' : 'อัพโหลด'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}