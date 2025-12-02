// react/src/components/GardenList.jsx
// react/src/components/GardenList.jsx
import React from "react";

function GardenList({ gardens, onSelect }) {
  if (!gardens || gardens.length === 0) return null;
  return (
    <div className="garden-list">
      {gardens.map((garden) => (
        <div key={garden.id} className="garden-item" onClick={() => onSelect(garden)}>
          <h3>{garden.name}</h3>
          <p><strong>Neighbourhood:</strong> {garden.neighborhood || "Unknown"}</p>
          <p><strong>Plots Available:</strong> {garden.plots_available ? garden.plots_available : "N/A"}</p>
        </div>
      ))}
    </div>
  );
}

export default GardenList;
