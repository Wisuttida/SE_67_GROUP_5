import React from 'react'

export default function Banner() {
  return (
    <div className="flex justify-center items-center">
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg w-10/12">
            <img src="/path/to/product1.jpg" alt="Product 1" className="w-full h-48 object-cover rounded-lg" />
        </div>
    </div>
  )
}
