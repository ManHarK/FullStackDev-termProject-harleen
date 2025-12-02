
// react/src/components/GardenDetails.jsx
import React from "react";

function GardenDetails({ garden, onBack }) {
  if (!garden) return null;

  return (
    <div className="details">
      <div style={{ textAlign: "center", marginBottom: "16px", marginTop: "35px" }}>
        <button onClick={onBack}>Back to List</button>
      </div>

      <h2>{garden.name}</h2>
      <p><strong>Neighbourhood:</strong> {garden.neighborhood || "Unknown"}</p>
      <p><strong>Address:</strong> {garden.address || "No address"}</p>
      <p><strong>Type:</strong> {garden.type || "N/A"}</p>
      <p><strong>Year Created:</strong> {garden.year_created || "N/A"}</p>
      <p><strong>Food/Tree Varieties:</strong> {garden.food_tree_varieties || "N/A"}</p>
      <p><strong>Jurisdiction:</strong> {garden.jurisdiction || "N/A"}</p>
      <p><strong>Maintained By:</strong> {garden.steward || "N/A"}</p>

      <p><strong>Plots available :</strong> {garden.plots_available || "N/A"}</p>

      <p><strong>Contact:</strong> {garden.contact || garden.public_email || "No contact listed"}</p>
      <p><strong>Website:</strong> {garden.website ? <a href={garden.website} target="_blank" rel="noreferrer">{garden.website}</a> : "N/A"}</p>

      <h3>How to Join</h3>
      <ul>
        {garden.contact && <li>Contact the garden coordinator: {garden.contact}</li>}

        <li>Follow garden rules and community guidelines</li>
        <li>Some gardens may require volunteer hours</li>
      </ul>
    </div>
  );
}

export default GardenDetails;
