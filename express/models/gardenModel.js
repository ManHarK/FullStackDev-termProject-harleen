// express/models/gardenModel.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "../db/database.db"));

module.exports = {
  getAll(callback) {
    db.all("SELECT * FROM gardens ORDER BY id", [], (err, rows) => callback(err, rows));
  },

  getById(id, callback) {
    db.get("SELECT * FROM gardens WHERE id = ?", [id], (err, row) => callback(err, row));
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
      data.steward || data.steward_or_managing_organization || "",
      data.public_email || data.public_e_mail || "",
      data.website || "",
      data.geo_local_area || data.geo_local_area || ""
    ];
    db.run(sql, params, function (err) {
      if (err) return callback(err);
      // return the newly-created row
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
      data.steward || data.steward_or_managing_organization || "",
      data.public_email || data.public_e_mail || "",
      data.website || "",
      data.geo_local_area || "",
      id
    ];
    db.run(sql, params, function (err) {
      if (err) return callback(err);
      // return updated row
      db.get("SELECT * FROM gardens WHERE id = ?", [id], (e, row) => callback(e, row));
    });
  },

  delete(id, callback) {
    db.run("DELETE FROM gardens WHERE id = ?", [id], function (err) {
      callback(err, { changes: this.changes });
    });
  }
};
