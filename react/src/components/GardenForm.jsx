// react/src/components/GardenForm.jsx
import React, { useState, useEffect } from "react";
import { createGarden, updateGarden } from "../api";

export default function GardenForm({ editingGarden, onSaved, onCancel }) {
  // editingGarden
  const [name, setName] = useState("");
  const [type, setType] = useState("Food");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [contact, setContact] = useState("");
  const [plotsAvailable, setPlotsAvailable] = useState("");
  const [yearCreated, setYearCreated] = useState("");
  const [foodTreeVarieties, setFoodTreeVarieties] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [steward, setSteward] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (editingGarden) {
      setName(editingGarden.name || "");
      setType(editingGarden.type || "Food");
      setNeighborhood(editingGarden.neighborhood || "");
      setAddress(editingGarden.address || "");
      setLongitude(editingGarden.longitude || "");
      setLatitude(editingGarden.latitude || "");
      setContact(editingGarden.contact || "");
      setPlotsAvailable(editingGarden.plots_available || "");
      setYearCreated(editingGarden.year_created || "");
      setFoodTreeVarieties(editingGarden.food_tree_varieties || "");
      setJurisdiction(editingGarden.jurisdiction || "");
      setSteward(editingGarden.steward || "");
      setPublicEmail(editingGarden.public_email || "");
      setWebsite(editingGarden.website || "");
    } else {
      // reset
      setName("");
      setType("Food");
      setNeighborhood("");
      setAddress("");
      setLongitude("");
      setLatitude("");
      setContact("");
      setPlotsAvailable("");
      setYearCreated("");
      setFoodTreeVarieties("");
      setJurisdiction("");
      setSteward("");
      setPublicEmail("");
      setWebsite("");
    }
  }, [editingGarden]);

  async function handleSubmit(e) {
    e.preventDefault();

    const plotsNum = Number(plotsAvailable);

    if (isNaN(plotsNum) || plotsNum < 0) {
      alert("Plots available must be a number greater than or equal to 0.");
      return;
    }

    const payload = {
      name,
      type,
      neighborhood,
      address,
      longitude: longitude ? Number(longitude) : 0,
      latitude: latitude ? Number(latitude) : 0,
      contact,
      plots_available: plotsAvailable ? Number(plotsAvailable) : 0,
      year_created: yearCreated,
      food_tree_varieties: foodTreeVarieties,
      jurisdiction,
      steward,
      public_email: publicEmail,
      website,
      geo_local_area: neighborhood
    };

    try {
      if (editingGarden) {
        const updated = await updateGarden(editingGarden.id, payload);
        alert("Garden " + payload.name + " details have been Updated");
        onSaved(updated); // parent updates state
      } else {
        const created = await createGarden(payload);
        alert("New garden " + payload.name + " has been Added");
        onSaved(created);
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving garden: " + err.message);
    }
  }

  return (
    <form className="garden-form" onSubmit={handleSubmit}>
      <h2>{editingGarden ? "Edit Garden" : "Add New Garden"}</h2>

      <div className="form-row">
        <div className="form-col">
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-col">
          <input placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
        </div>
        <div className="form-col">
          <input placeholder="Neighbourhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
        </div>
        <div className="form-col">
          <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <input placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
        <div className="form-col">
          <input placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </div>
        <div className="form-col">
          <input placeholder="Contact (Email/Phone)" value={contact} onChange={(e) => setContact(e.target.value)} />
        </div>
        <div className="form-col">
          <input placeholder="Plots Available" value={plotsAvailable} onChange={(e) => setPlotsAvailable(e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <input placeholder="Year Created" value={yearCreated} onChange={(e) => setYearCreated(e.target.value)} />
        </div>
        <div className="form-col">
          <input placeholder="Food/Tree Varieties" value={foodTreeVarieties} onChange={(e) => setFoodTreeVarieties(e.target.value)} />
        </div>
        <div className="form-col">
          <input placeholder="Jurisdiction" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} />
        </div>
        <div className="form-col">
          <input placeholder="Organization" value={steward} onChange={(e) => setSteward(e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <input placeholder="Public Email" value={publicEmail} onChange={(e) => setPublicEmail(e.target.value)} />
        </div>
        <div className="form-col">
          <input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button type="submit">{editingGarden ? "Update Garden" : "Add Garden"}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
