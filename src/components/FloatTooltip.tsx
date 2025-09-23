"use client";

import { useEffect, useState } from "react";
import type { TooltipData } from "@/types/argo";

interface FloatTooltipProps {
  data: TooltipData | null;
  position: { x: number; y: number } | null;
  visible: boolean;
}

export default function FloatTooltip({
  data,
  position,
  visible,
}: FloatTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible && data && position) {
      // Small delay for smooth transition
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [visible, data, position]);

  if (!data || !position || !visible) {
    return null;
  }

  // Format the date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date
        .toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", "");
    } catch {
      return dateString;
    }
  };

  // Calculate tooltip position to avoid going off screen
  const getTooltipStyle = () => {
    const tooltipWidth = 280;
    const tooltipHeight = 120;
    const padding = 10;

    let left = position.x + 15;
    let top = position.y - tooltipHeight / 2;

    // Check if tooltip goes off the right edge
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = position.x - tooltipWidth - 15;
    }

    // Check if tooltip goes off the top edge
    if (top < padding) {
      top = padding;
    }

    // Check if tooltip goes off the bottom edge
    if (top + tooltipHeight > window.innerHeight - padding) {
      top = window.innerHeight - tooltipHeight - padding;
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "scale(1)" : "scale(0.95)",
    };
  };

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-200 ease-out"
      style={getTooltipStyle()}
    >
      <div className="bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 p-3 min-w-[280px]">
        {/* Header with ID */}
        <div className="font-semibold text-blue-300 text-sm mb-2 border-b border-gray-700 pb-1">
          ID: {data.id}
        </div>

        {/* Coordinates */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-300">Long / Lat:</span>
            <span className="font-mono text-white">
              {data.longitude.toFixed(1)} / {data.latitude.toFixed(1)}
            </span>
          </div>

          {/* Date */}
          <div className="flex justify-between">
            <span className="text-gray-300">Date:</span>
            <span className="font-mono text-white text-xs">
              {formatDate(data.date)}
            </span>
          </div>

          {/* Cycle */}
          <div className="flex justify-between">
            <span className="text-gray-300">Cycle:</span>
            <span className="font-mono text-white">{data.cycle}</span>
          </div>
        </div>

        {/* Small arrow pointing to the float */}
        <div
          className="absolute w-0 h-0 border-solid"
          style={{
            left:
              position.x < window.innerWidth / 2 ? "-6px" : "calc(100% - 6px)",
            top: "50%",
            transform: "translateY(-50%)",
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft:
              position.x < window.innerWidth / 2 ? "none" : "6px solid #1f2937",
            borderRight:
              position.x < window.innerWidth / 2 ? "6px solid #1f2937" : "none",
          }}
        />
      </div>
    </div>
  );
}
