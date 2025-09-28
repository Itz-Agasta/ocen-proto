"use client";
import { useState } from "react";
import Chat from "@/components/Chat";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import {
  HomeSidebar,
  type HomeSidebarFilters,
} from "@/components/home/HomeSidebar";
import InteractiveArgoMap from "@/components/home/InteractiveArgoMap";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  const [isChatVisible, setIsChatVisible] = useState(false);
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
        <header className="relative flex items-center h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shrink-0 z-50">
          <SidebarTrigger className="mr-4" />
          <div className="flex-1 h-full flex items-center">
            <HomeNavbar onOpenChat={handleOpenChat} />
          </div>
        </header>

        {/* Main content area - Interactive Map */}
        <main className="flex-1 w-full h-full">
          <div className="w-full h-full overflow-hidden">
            <InteractiveArgoMap />
          </div>
        </main>

        {/* Chat Interface */}
        {isChatVisible && <Chat onClose={() => setIsChatVisible(false)} />}
      </SidebarInset>
    </>
  );
}
