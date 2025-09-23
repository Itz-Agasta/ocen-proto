"use client";
import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import InteractiveArgoMap from "@/components/home/InteractiveArgoMap";

export default function Home() {
  const [isChatVisible, setIsChatVisible] = useState(true);

  return (
    <div className="h-screen bg-gray-900 text-white relative">
      {/* Main content area - Interactive Map */}
      <div className="w-full h-full bg-gray-900">
        <InteractiveArgoMap />
      </div>

      {/* Chat Interface */}
      <ChatInterface
        isVisible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
      />

      {/* Chat Toggle Button (when closed) */}
      {!isChatVisible && (
        <button
          type="button"
          onClick={() => setIsChatVisible(true)}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 z-50"
          aria-label="Open chat"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
