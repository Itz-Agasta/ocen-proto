"use client";
import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import InteractiveArgoMap from "@/components/home/InteractiveArgoMap";

export default function Home() {
  const [isChatVisible, setIsChatVisible] = useState(true);

  const handleOpenChat = () => {
    setIsChatVisible(true);
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Navigation Bar */}
      <HomeNavbar onOpenChat={handleOpenChat} />

      {/* Main content area - Interactive Map */}
      <div className="flex-1 w-full bg-gray-900">
        <InteractiveArgoMap />
      </div>

      {/* Chat Interface */}
      <ChatInterface
        isVisible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
      />
    </div>
  );
}
