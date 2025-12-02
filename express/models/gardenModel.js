// express/models/gardenModel.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../db/database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initDatabase();
  }
});

function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS gardens (
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
  `, (err) => {
    if (err) {
      console.error('Error creating/checking table:', err.message);
    } else {
      console.log('Gardens table verified');
      checkAndAddSampleData();
    }
  });
}

function checkAndAddSampleData() {
  db.get("SELECT COUNT(*) as count FROM gardens", (err, row) => {
    if (err) {
      console.error('Error checking data:', err.message);
      return;
    }
    
    const count = row ? row.count : 0;
    console.log(`Found ${count} gardens in database`);
    
    if (count === 0) {
      console.log('Database is empty. Importing from gardens.json...');
      importFromJSON();
    }
  });
}

function importFromJSON() {
  const fs = require('fs');
  const jsonPath = path.join(__dirname, "../data/gardens.json");
  
  if (!fs.existsSync(jsonPath)) {
    console.log('No gardens.json file found at:', jsonPath);
    return;
  }
  
  try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const gardensData = JSON.parse(rawData);
    console.log(`Found ${gardensData.length} gardens in JSON file`);
    
    const stmt = db.prepare(`
      INSERT INTO gardens (
        name, type, neighborhood, address, longitude, latitude, contact, 
        plots_available, year_created, food_tree_varieties, jurisdiction, 
        steward, public_email, website, geo_local_area
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    let imported = 0;
    gardensData.forEach((item) => {
      const data = item.fields || item;
      
      const name = data.name || data.merged_address || "Unknown Garden";
      const type = (data.type && String(data.type)) || (data.jurisdiction && "Community") || "Food";
      const neighborhood = data.geo_local_area || data.neighbourhood_name || "Unknown";
      const address = data.merged_address || `${data.street_number || ""} ${data.street_name || ""}`.trim() || "No address";
      
      // Extract coordinates
      let lon = 0, lat = 0;
      if (data.geo_point_2d && Array.isArray(data.geo_point_2d)) {
        lon = data.geo_point_2d[1] || 0;
        lat = data.geo_point_2d[0] || 0;
      } else if (data.geo_point_2d && typeof data.geo_point_2d === "object") {
        lon = data.geo_point_2d.lon || 0;
        lat = data.geo_point_2d.lat || 0;
      }
      
      stmt.run(
        name,
        type,
        neighborhood,
        address,
        Number(lon) || -123.1207,
        Number(lat) || 49.2827,
        data.public_e_mail || "No contact",
        data.number_of_plots || 0,
        data.year_created || "",
        data.food_tree_varieties || "",
        data.jurisdiction || "",
        data.steward_or_managing_organization || "",
        data.public_e_mail || "",
        data.website || "",
        data.geo_local_area || ""
      );
      imported++;
    });
    
    stmt.finalize();
    console.log(`Successfully imported ${imported} gardens from JSON`);
    
  } catch (error) {
    console.error('Error importing from JSON:', error.message);
  }
}

module.exports = {
  getAll(callback) {
    db.all("SELECT * FROM gardens ORDER BY id", [], (err, rows) => {
      if (err) {
        console.error('Database error in getAll:', err.message);
        callback(err, null);
      } else {
        console.log(`Query returned ${rows ? rows.length : 0} gardens`);
        callback(null, rows || []);
      }
    });
  },

  getById(id, callback) {
    db.get("SELECT * FROM gardens WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error('Database error in getById:', err.message);
      }
      callback(err, row);
    });
  },

  create(data, callback) {
    const sql = `
      INSERT INTO gardens (
        name, type, neighborhood, address, longitude, latitude, contact, plots_available,
        year_created, food_tree_varieties, jurisdiction, steward, public_email, website, geo_local_area
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.name || "",
      data.type || "",
      data.neighborhood || "",
      data.address || "",
      Number(data.longitude) || 0,
      Number(data.latitude) || 0,
      data.contact || "",
      Number(data.plots_available) || 0,
      data.year_created || "",
      data.food_tree_varieties || "",
      data.jurisdiction || "",
      data.steward || "",
      data.public_email || "",
      data.website || "",
      data.geo_local_area || ""
    ];
    
    db.run(sql, params, function (err) {
      if (err) {
        console.error('Database error in create:', err.message);
        return callback(err);
      }
      db.get("SELECT * FROM gardens WHERE id = ?", [this.lastID], (e, row) => callback(e, row));
    });
  },

  update(id, data, callback) {
    const sql = `
      UPDATE gardens SET
      name = ?, type = ?, neighborhood = ?, address = ?, longitude = ?, latitude = ?,
      contact = ?, plots_available = ?, year_created = ?, food_tree_varieties = ?, jurisdiction = ?,
      steward = ?, public_email = ?, website = ?, geo_local_area = ?
      WHERE id = ?
    `;
    const params = [
      data.name || "",
      data.type || "",
      data.neighborhood || "",
      data.address || "",
      Number(data.longitude) || 0,
      Number(data.latitude) || 0,
      data.contact || "",
      Number(data.plots_available) || 0,
      data.year_created || "",
      data.food_tree_varieties || "",
      data.jurisdiction || "",
      data.steward || "",
      data.public_email || "",
      data.website || "",
      data.geo_local_area || "",
      id
    ];
    db.run(sql, params, function (err) {
      if (err) {
        console.error('Database error in update:', err.message);
        return callback(err);
      }
      db.get("SELECT * FROM gardens WHERE id = ?", [id], (e, row) => callback(e, row));
    });
  },

  delete(id, callback) {
    db.run("DELETE FROM gardens WHERE id = ?", [id], function (err) {
      if (err) {
        console.error('Database error in delete:', err.message);
      }
      callback(err, { changes: this.changes });
    });
  }
};