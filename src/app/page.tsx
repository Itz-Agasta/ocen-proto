"use client";
import { useState } from "react";
import Chat from "@/components/Chat";
import ChatInterface from "@/components/ChatInterface";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import {
  HomeSidebar,
  type HomeSidebarFilters,
} from "@/components/home/HomeSidebar";
import InteractiveArgoMap from "@/components/home/InteractiveArgoMap";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  const [isChatVisible, setIsChatVisible] = useState(true);
  // Filter state for the sidebar (currently for future use when connecting with map filters)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filters, setFilters] = useState<HomeSidebarFilters>({
    timePeriod: "all",
    datasets: {
      argoCore: true,
      argoBGC: true,
      argoDeep: false,
      woce: false,
      goShip: false,
      otherShips: false,
      drifters: false,
      tropicalCyclones: false,
    },
    deploymentYears: { start: 2000, end: new Date().getFullYear() },
  });

  const handleOpenChat = () => {
    setIsChatVisible(true);
  };

  const handleFiltersChange = (newFilters: HomeSidebarFilters) => {
    setFilters(newFilters);
    // Here you can add logic to update your map or data based on filters
    console.log("Filters updated:", newFilters);
  };

  return (
    <>
      {/* Sidebar */}
      <HomeSidebar onFiltersChange={handleFiltersChange} />

      {/* Main Content */}
      <SidebarInset className="flex flex-col min-h-screen">
        {/* Navigation Bar with Sidebar Trigger */}
        <header className="flex items-center h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shrink-0">
          <SidebarTrigger className="mr-4" />
          <div className="flex-1 h-full flex items-center overflow-hidden">
            <HomeNavbar onOpenChat={handleOpenChat} />
          </div>
        </header>

        {/* Main content area - Interactive Map */}
        <main className="flex-1 w-full h-full overflow-hidden">
          <div className="w-full h-full">
            <InteractiveArgoMap />
          </div>
        </main>

        {/* Chat Interface */}
        <ChatInterface
          isVisible={isChatVisible}
          onClose={() => setIsChatVisible(false)}
        />
        {isChatVisible && <Chat onClose={() => setIsChatVisible(false)} />}

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
              <title>Chat Icon</title>
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
            </svg>
          </button>
        )}
      </SidebarInset>
    </>
  );
}
