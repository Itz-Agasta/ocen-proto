"use client";

import type { PopupData } from "@/types/argo";

interface InlineFloatPopupProps {
  data: PopupData | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onShowProfile?: () => void;
  visible: boolean;
}

export default function FloatPopup({
  data,
  position,
  onClose,
  onShowProfile,
  visible,
}: InlineFloatPopupProps) {
  if (!data || !position || !visible) {
    return null;
  }

  // Format the date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        " " +
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    } catch {
      return dateString;
    }
  };

  const handleActionClick = (action: string) => {
    if (action === "Show Profile Data" && onShowProfile) {
      onShowProfile();
    } else {
      console.log(`Action clicked: ${action} for float ${data.floatNumber}`);
      alert(`${action} for Float ${data.floatNumber} - Feature coming soon!`);
    }
  };

  // Calculate position to keep popup on screen
  const getPopupStyle = () => {
    const popupWidth = 320;
    const popupHeight = 350; // Increased for 3 buttons
    const padding = 20;

    let left = position.x + 10;
    let top = position.y - popupHeight / 2;

    // Adjust if popup goes off right edge
    if (left + popupWidth > window.innerWidth - padding) {
      left = position.x - popupWidth - 10;
    }

    // Adjust if popup goes off top edge
    if (top < padding) {
      top = padding;
    }

    // Adjust if popup goes off bottom edge
    if (top + popupHeight > window.innerHeight - padding) {
      top = window.innerHeight - popupHeight - padding;
    }

    return {
      left: `${Math.max(padding, left)}px`,
      top: `${Math.max(padding, top)}px`,
    };
  };

  return (
    <div
      className="fixed z-50 bg-slate-50 bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-200/50 animate-in fade-in zoom-in duration-200"
      style={getPopupStyle()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/50">
        <h3 className="text-sm font-bold text-slate-800">
          Float {data.floatNumber} - Cycle {data.cycle}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200/50"
          aria-label="Close popup"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Close</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 max-w-xs">
        {/* Basic Information */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-medium">Date:</span>
            <span className="text-slate-800 font-mono">
              {formatDate(data.date)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-medium">Platform:</span>
            <span className="text-slate-800">{data.platformType}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-medium">PI:</span>
            <span className="text-slate-800">{data.pi}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-medium">Telecom:</span>
            <span className="text-slate-800">{data.telecomCode}</span>
          </div>
        </div>

        {/* Sensors */}
        <div>
          <div className="text-xs font-medium text-slate-700 mb-2">
            Sensors:
          </div>
          <div className="flex flex-wrap gap-1">
            {data.sensors.map((sensor) => (
              <span
                key={sensor}
                className="inline-block px-2 py-1 text-xs bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 rounded-md border border-cyan-200"
              >
                {sensor}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-200/50">
          <div className="text-xs font-medium text-slate-700 mb-2">
            Actions:
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleActionClick("Show Profile Data")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-xs"
            >
              Show Profile Data
            </button>
            <button
              type="button"
              onClick={() => handleActionClick("Show Float Trajectory")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-xs"
            >
              Show Float Trajectory
            </button>
            <button
              type="button"
              onClick={() => handleActionClick("Go to Float Page")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-xs"
            >
              Go to Float Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
