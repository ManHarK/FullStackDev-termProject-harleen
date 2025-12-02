// express/data/import.js
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Read JSON file
const raw = fs.readFileSync(path.join(__dirname, "gardens.json"), "utf8");
const json = JSON.parse(raw);

// Open SQLite DB (will create file if missing)
const dbPath = path.join(__dirname, "../db/database.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Drop old table if exists
  db.run("DROP TABLE IF EXISTS gardens");

  // Create table 
  db.run(`
    CREATE TABLE gardens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      neighborhood TEXT,
      address TEXT,
      longitude REAL,
      latitude REAL,
      contact TEXT,
      plots_available INTEGER,
      year_created TEXT,
      food_tree_varieties TEXT,
      jurisdiction TEXT,
      steward TEXT,
      public_email TEXT,
      website TEXT,
      geo_local_area TEXT
    )
  `);

  // insert query
  const stmt = db.prepare(`
    INSERT INTO gardens (
      name, type, neighborhood, address, longitude, latitude, contact, plots_available,
      year_created, food_tree_varieties, jurisdiction, steward, public_email, website, geo_local_area
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  json.forEach((item) => {
    const data = item.fields || item;

    const name = data.name || data.merged_address || "Unknown";
    const type = (data.type && String(data.type)) || (data.jurisdiction && "Community") || "Food";
    const neighborhood = data.geo_local_area || data.neighbourhood_name || "Unknown";
    const address = data.merged_address || `${data.street_number || ""} ${data.street_name || ""}`.trim() || "No address";
    const contact = data.public_e_mail || data.contacts || "No contact";
    const plots = data.number_of_plots || data.total_plots || 0;

  
    let lon = 0, lat = 0; // lon =longitude, lat = latitude
    if (data.geo_point_2d && Array.isArray(data.geo_point_2d)) {
      lon = data.geo_point_2d[1] || 0; 
      lat = data.geo_point_2d[0] || 0;

      if (Math.abs(lon) > 180) { 
        const t = lon;
        lon = lat;
        lat = t;
      }
    } else if (data.geo_point_2d && typeof data.geo_point_2d === "object") {
      lon = data.geo_point_2d.lon || data.geo_point_2d[1] || 0;
      lat = data.geo_point_2d.lat || data.geo_point_2d[0] || 0;
    } else if (data.geom && data.geom.geometry && Array.isArray(data.geom.geometry.coordinates)) {
      lon = data.geom.geometry.coordinates[0] || 0;
      lat = data.geom.geometry.coordinates[1] || 0;
    }

    const year_created = data.year_created || "";
    const food_tree_varieties = data.food_tree_varieties || data.other_food_assets || "";
    const jurisdiction = data.jurisdiction || "";
    const steward = data.steward_or_managing_organization || "";
    const public_email = data.public_e_mail || "";
    const website = data.website || "";
    const geo_local_area = data.geo_local_area || "";

    stmt.run(
      name,
      type,
      neighborhood,
      address,
      Number(lon) || 0,
      Number(lat) || 0,
      contact,
      Number(plots) || 0,
      year_created,
      food_tree_varieties,
      jurisdiction,
      steward,
      public_email,
      website,
      geo_local_area
    );
  });

  stmt.finalize();
});

db.close();
console.log(" Done Imported all Vancouver gardens into SQLite!");
