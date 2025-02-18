import React from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const profileShop = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
      {/* Profile Section */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <div>
            <h2 className="text-lg font-semibold">Username</h2>
            <button className="text-blue-500">✏️ Edit Profile</button>
          </div>
        </div>
        <div className="flex items-center">
          <label className="mr-2">Accepting customize from customer</label>
          <input type="checkbox" className="toggle-checkbox" />
        </div>
      </div>

      {/* Navigation Section */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {[
          "My Profile",
          "My Product",
          "Order Customize",
          "Add Product",
          "Buy Ingredient",
          "To Ship",
          "To Receive",
        ].map((item, index) => (
          <div key={index} className="p-4 bg-white shadow-md rounded-lg text-center">
            <p>{item}</p>
          </div>
        ))}
      </div>

      {/* Shop Address Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-lg font-semibold">Shop Address</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {[
            "Firstname",
            "Lastname",
            "Phone Number",
            "Province",
            "District",
            "Sub District",
            "Postal code",
            "Street Name",
            "Building",
            "House No.",
          ].map((field, index) => (
            <div key={index} className="border-b pb-1">{field}</div>
          ))}
        </div>
        <button className="text-blue-500 mt-2">✏️ Edit Address</button>
      </div>

      {/* Description Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-lg font-semibold">Description</h3>
        <textarea className="w-full p-2 border rounded-lg mt-2" placeholder="Text"></textarea>
      </div>
    </div>

      

    </div>
  )
}

export default profileShop