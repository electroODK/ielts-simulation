// src/pages/EndPage.jsx

import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EndPage = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const idFromState = location?.state?.userId;
  const effectiveUserId = idFromState || userId || "";
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Thank you for taking the test!
        </h1>
        <p className="text-lg mb-2 text-gray-700">
          This is your ID:
        </p>
        <p className="text-xl font-mono font-semibold text-blue-600 mb-6">
          {effectiveUserId}
        </p>
        <p className="text-gray-600">
          Wait for your results in our{" "}
          <a
            href="https://t.me/your_channel" // 👉 замени на свою ссылку
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Telegram Channel
          </a>
        </p>
        <button onClick={()=>navigate('/')} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go Home</button>
      </div>
    </div>
  );
};

export default EndPage;
