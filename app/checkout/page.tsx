"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import QRCode from "react-qr-code";
import { useRouter, useSearchParams } from "next/navigation";

interface Product {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // รับค่าจาก query parameter "items" เป็น comma-separated list ของ productId
  const selectedItemsQuery = searchParams.get("items");
  const confirmedProductIds = selectedItemsQuery
    ? selectedItemsQuery.split(",").map((id) => Number(id))
    : [];

  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    phone: "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // โหลด cart จาก localStorage ตอนโหลดหน้า
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const calculateTotal = () => {
    // คำนวณเฉพาะสินค้าที่อยู่ใน confirmedProductIds
    const total = cartItems
      .filter((item) => confirmedProductIds.includes(item.productId))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    return total.toFixed(2);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handlePayment = () => {
    // ตรวจสอบข้อมูลการจัดส่ง
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
      alert("กรุณากรอกข้อมูลการจัดส่งให้ครบถ้วน");
      return;
    }
    // ตรวจสอบหลักฐานการโอน
    if (!paymentProof) {
      alert("กรุณาแนบหลักฐานการโอนเงิน");
      return;
    }

    setIsProcessing(true);

    // จำลองการประมวลผลการชำระเงิน
    setTimeout(() => {
      console.log("Payment Details:", {
        shipping: shippingInfo,
        paymentProof: paymentProof.name,
        items: cartItems.filter((item) =>
          confirmedProductIds.includes(item.productId)
        ),
        total: calculateTotal(),
      });

      // ลบเฉพาะสินค้าที่ถูกเลือกออกจากตะกร้า
      const remainingCart = cartItems.filter(
        (item) => !confirmedProductIds.includes(item.productId)
      );
      localStorage.setItem("cart", JSON.stringify(remainingCart));
      setCartItems(remainingCart);
      window.dispatchEvent(new Event("storage"));

      alert("ชำระเงินเรียบร้อยแล้ว!");
      setIsProcessing(false);

      // นำผู้ใช้กลับไปหน้าตะกร้า
      router.push("/cart");
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Payment</h1>

        {/* Order Summary */}
        <div className="border p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.filter((item) =>
            confirmedProductIds.includes(item.productId)
          ).length === 0 ? (
            <p>No selected items in your order.</p>
          ) : (
            cartItems
              .filter((item) => confirmedProductIds.includes(item.productId))
              .map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
          )}
          {cartItems.filter((item) =>
            confirmedProductIds.includes(item.productId)
          ).length > 0 && (
            <h2 className="text-xl font-bold mt-4">
              Total: ${calculateTotal()}
            </h2>
          )}
        </div>

        {/* Shipping Information */}
        <div className="border p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={shippingInfo.fullName}
              onChange={handleShippingChange}
            />
            <Input
              type="text"
              name="address"
              placeholder="Shipping Address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
            />
            <Input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={shippingInfo.phone}
              onChange={handleShippingChange}
            />
          </div>
        </div>

        {/* Transfer Payment Section */}
        <div className="border p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Transfer Payment</h2>
          <div className="flex flex-col items-center">
            {/* QRCode สำหรับแสกนโอนเงิน */}
            <QRCode
              value="https://yourbanktransferlink.com?account=123456789"
              size={128}
            />
            <p className="mt-2 text-gray-700">Scan to transfer money</p>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 mb-2">
              Upload Proof of Transfer
            </label>
            <input
              type="file"
              accept="image/*"
              className="border p-2 rounded w-full"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <Button
          className="mt-6 w-full"
          onClick={handlePayment}
          disabled={
            cartItems.filter((item) =>
              confirmedProductIds.includes(item.productId)
            ).length === 0 || isProcessing
          }
        >
          {isProcessing ? "Processing Payment..." : "Confirm Payment"}
        </Button>
      </div>
    </>
  );
};

export default CheckoutPage;
