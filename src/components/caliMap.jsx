import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Coordinates and image paths (images should be in /public folder)
const markers = [
  {
    name: "Los Angeles",
    coordinates: [-118.2437, 34.0522],
    image: "/1.jpg",
  },
  {
    name: "San Francisco",
    coordinates: [-122.4194, 37.7749],
    image: "/2.jpg",
  },
  {
    name: "San Diego",
    coordinates: [-117.1611, 32.7157],
    image: "/3.jpg",
  },
  {
    name: "Sacramento",
    coordinates: [-121.4944, 38.5816],
    image: "/4.jpg",
  },
];

const CaliforniaMap = () => {
  const [position, setPosition] = useState({
    center: [-98.5795, 39.8283],
    zoom: 1,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);

  const animateZoom = (from, to, duration = 600) => {
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      const newCenter = [
        from.center[0] + (to.center[0] - from.center[0]) * ease,
        from.center[1] + (to.center[1] - from.center[1]) * ease,
      ];
      const newZoom = from.zoom + (to.zoom - from.zoom) * ease;

      setPosition({ center: newCenter, zoom: newZoom });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const handleMarkerClick = (marker) => {
    animateZoom(position, { center: marker.coordinates, zoom: 4 });
    setSelectedMarker(marker);
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 flex justify-center items-center">
      {/* Zoom Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() =>
            setPosition((prev) => ({
              ...prev,
              zoom: Math.min(prev.zoom + 0.5, 10),
            }))
          }
          className="bg-white shadow-md border border-gray-300 rounded p-2 hover:bg-gray-100 transition"
        >
          +
        </button>
        <button
          onClick={() =>
            setPosition((prev) => ({
              ...prev,
              zoom: Math.max(prev.zoom - 0.5, 1),
            }))
          }
          className="bg-white shadow-md border border-gray-300 rounded p-2 hover:bg-gray-100 transition"
        >
          −
        </button>
      </div>

      {/* Map */}
      <div className="w-full h-full">
        <ComposableMap
          projection="geoAlbersUsa"
          width={980}
          height={600}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup
            center={position.center}
            zoom={position.zoom}
            maxZoom={10}
            minZoom={1}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EAEAEC"
                    stroke="#D6D6DA"
                  />
                ))
              }
            </Geographies>

            {markers.map(({ name, coordinates, image }) => (
              <Marker
                key={name}
                coordinates={coordinates}
                onClick={() => handleMarkerClick({ name, coordinates, image })}
                style={{ cursor: "pointer" }}
              >
                <circle
                  r={6}
                  fill="#2563eb"
                  stroke="#fff"
                  strokeWidth={1.5}
                  className="transition duration-300 hover:fill-red-500"
                />
                <text
                  textAnchor="middle"
                  y={-12}
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: "Arial", fontSize: "10px" }}
                >
                  {name}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Info Card */}
      {selectedMarker && (
  <div className="absolute bottom-8 left-8 z-10 animate-fade-in">
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-80 p-4">
      <div className="text-lg font-semibold text-gray-800 mb-2">{selectedMarker.name}</div>
      
      <img
        src={selectedMarker.image}
        alt={`Pothole in ${selectedMarker.name}`}
        onError={(e) => (e.target.src = "/placeholder.jpg")}
        className="w-full h-44 object-cover rounded-lg mb-3"
      />

      <p className="text-sm text-gray-700 leading-snug mb-2">
        A reported pothole near {selectedMarker.name}. Please take care while driving in this area.
      </p>

      <div className="text-xs text-gray-500">
        <strong>Lat:</strong> {selectedMarker.coordinates[1].toFixed(4)}<br />
        <strong>Lng:</strong> {selectedMarker.coordinates[0].toFixed(4)}
      </div>

      <button
        onClick={() => setSelectedMarker(null)}
        className="mt-3 inline-block text-blue-600 text-sm hover:underline"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default CaliforniaMap;
