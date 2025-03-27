import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="loader"></div>
            <p className="mt-4 text-lg text-gray-700 animate-pulse">กำลังโหลด</p>
            <style jsx>{`
                .loader {
                    border: 20px solid #f3f3f3; /* Light grey */
                    border-top: 20px solid #3498db; /* Blue */
                    border-radius: 50%;
                    width: 100px;
                    height: 100px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Spinner;