// react/src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GardenList from "./components/GardenList";
import GardenDetails from "./components/GardenDetails";
import Filter from "./components/Filter";
import GardenForm from "./components/GardenForm";
import GardenMap from "./components/GardenMap";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import { getGardens, createGarden, updateGarden, deleteGarden } from "./api";
import "./app.css";

// Leaflet icon urls 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function App() {
  const [gardens, setGardens] = useState([]);
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingGarden, setEditingGarden] = useState(null);

  // Ref for GardenDetails panel
  const detailsRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const data = await getGardens();
      setGardens(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load gardens: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }

  const filteredGardens = gardens.filter(g => {
    const name = (g.name || "").toString().toLowerCase();
    const ft = filterText.toLowerCase();
    const matchName = name.includes(ft);
    const matchType = typeFilter === "All" || (g.type || "").toString() === typeFilter;
    return matchName && matchType;
  });

  // Called by GardenForm when a garden is created or updated
  function handleSaved(garden) {
    if (!garden) return;
    const exists = gardens.find(g => g.id === garden.id);
    if (exists) {
      setGardens(gardens.map(g => g.id === garden.id ? garden : g));
      setEditingGarden(null);
      setShowForm(false);
    } else {
      setGardens([...gardens, garden]);
      setShowForm(false);
    }
  }

  async function handleDelete(g) {
    if (!window.confirm(`Are you sure you want to delete "${g.name}"?`)) return;
    try {
      await deleteGarden(g.id);
      setGardens(gardens.filter(x => x.id !== g.id));
      alert("Garden has been deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete garden: " + (err.message || ""));
    }
  }

  function startEdit(g) {
    setEditingGarden(g);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingGarden(null);
  }

  function handleBackFromNoResults() {
    setFilterText("");
    setTypeFilter("All");
  }

  // View garden and Focus to details
  function handleViewGarden(garden) {
    setSelectedGarden(garden);
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <div className="app-container">
      <header><h1>Vancouver Community Gardens Directory</h1></header>

      <div className="controls">
        <Filter value={filterText} onChange={setFilterText} />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Food">Food</option>
          <option value="Flowers">Flowers</option>
          <option value="Community">Community</option>
        </select>
        <button onClick={() => { setShowForm(!showForm); setEditingGarden(null); }}>
          {showForm ? "Close Form" : "Create New Garden"}
        </button>
      </div>

      {showForm && (
        <GardenForm
          editingGarden={editingGarden}
          onSaved={handleSaved}
          onCancel={handleCancelForm}
        />
      )}

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && filteredGardens.length === 0 && (
        <div style={{ padding: 20 }}>
          <p>No Record Found for selected Category</p>
          <button onClick={handleBackFromNoResults}>Back</button>
        </div>
      )}

      {!loading && !error && filteredGardens.length > 0 && (
        <>

          <div className="map-container">
            <GardenMap gardens={filteredGardens} height={400} />
          </div>

          <div className="garden-grid">
            {filteredGardens.map(g => (
              <div key={g.id} className="garden-card">
                <h3>{g.name}</h3>
                <p><strong>Type:</strong> {g.type}</p>
                <p><strong>Neighborhood:</strong> {g.neighborhood}</p>
                <p><strong>Plots:</strong> {g.plots_available ?? "N/A"}</p>
                <p><strong>Contact:</strong> {g.contact || g.public_email || "N/A"}</p>

                <div className="actions">
                  <button onClick={() => handleViewGarden(g)}>View</button>
                  <button onClick={() => startEdit(g)}>Edit</button>
                  <button onClick={() => handleDelete(g)}>Delete</button>
                </div>
              </div>
            ))}
          </div>


          {/* GardenDetails Panel */}
          {selectedGarden && (
            <div ref={detailsRef}>
              <GardenDetails
                garden={selectedGarden}
                onBack={() => setSelectedGarden(null)}
              />
            </div>
          )}


        </>
      )}
    </div>
  );
}
