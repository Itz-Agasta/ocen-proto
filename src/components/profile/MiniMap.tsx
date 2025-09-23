"use client";

import { Map as MapboxMap, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MiniMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export function MiniMap({ latitude, longitude, className = "" }: MiniMapProps) {
  // Show error message if token is missing
  if (!MAPBOX_TOKEN) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center ${className}`}
        style={{ height: "160px" }}
      >
        <p className="text-sm text-muted-foreground text-center p-4">
          Mapbox token not configured
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-border ${className}`}
      style={{ height: "160px" }}
    >
      <MapboxMap
        initialViewState={{
          longitude,
          latitude,
          zoom: 8,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactive={false}
        attributionControl={false}
      >
        {/* Marker for the float position */}
        <Marker
          longitude={longitude}
          latitude={latitude}
          color="#ef4444"
          scale={0.8}
        />
      </MapboxMap>

      {/* Overlay with coordinates */}
      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
        {Math.abs(latitude).toFixed(2)}°{latitude >= 0 ? "N" : "S"}{" "}
        {Math.abs(longitude).toFixed(2)}°{longitude >= 0 ? "E" : "W"}
      </div>
    </div>
  );
}
