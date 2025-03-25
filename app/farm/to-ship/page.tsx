"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

interface ShipmentData {
  user: string;
  productName: string;
  description: string;
  amount: number;
  totalPrice: number;
}

const initialShipments: ShipmentData[] = [
  { user: "User1", productName: "Product Name", description: "Description", amount: 1, totalPrice: 100 },
  { user: "User2", productName: "Product Name", description: "Description", amount: 2, totalPrice: 200 },
  // Add more sample data as needed
];

export default function FarmToShip() {
  const { toast } = useToast();
  const [shipments, setShipments] = useState<ShipmentData[]>(initialShipments);

  const handleFinish = (index: number) => {
    // Logic to mark shipment as finished
    const updatedShipments = shipments.filter((_, i) => i !== index);
    setShipments(updatedShipments);
    toast("Shipment marked as finished.");
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">To Ship</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shipments.map((shipment, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <p className="font-medium">{shipment.user}</p>
                <p>Product Name: {shipment.productName}</p>
                <p>Description: {shipment.description}</p>
                <p>Amount: {shipment.amount}</p>
                <p>Total Price: {shipment.totalPrice} ฿</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => handleFinish(index)}
                >
                  Finish
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
