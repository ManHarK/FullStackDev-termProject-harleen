// react/src/components/GardenMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// show markers with valid coordinates
function validCoord(n) {
  return typeof n === "number" && !isNaN(n) && Math.abs(n) <= 200;
}

export default function GardenMap({ gardens, center = [49.2827, -123.1207], zoom = 12, height = 400 }) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: `${height}px`, width: "100%", margin: "20px 0" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      {gardens.map(g => {
        const lat = Number(g.latitude);
        const lon = Number(g.longitude);
        if (!validCoord(lat) || !validCoord(lon)) return null;
        return (
          <Marker key={g.id} position={[lat, lon]}>
            <Popup>
              <strong>{g.name}</strong><br />
              {g.address}<br />
              Plots: {g.plots_available || "N/A"}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
