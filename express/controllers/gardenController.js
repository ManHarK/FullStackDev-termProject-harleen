// express/controllers/gardenController.js
const model = require("../models/gardenModel");

module.exports = {
  getAll(req, res) {
    model.getAll((err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows);
    });
  },

  getOne(req, res) {
    const id = req.params.id;
    model.getById(id, (err, row) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!row) return res.status(404).json({ error: "Garden not found" });
      res.json(row);
    });
  },

  create(req, res) {
    if (!req.body.name || !req.body.address) {
      return res.status(400).json({ error: "Name and address are required" });
    }

    model.create(req.body, (err, createdRow) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(createdRow);
    });
  },

  update(req, res) {
    const id = req.params.id;
    model.update(id, req.body, (err, updatedRow) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!updatedRow) return res.status(404).json({ error: "Garden not found" });
      res.json(updatedRow);
    });
  },

  deleteGarden(req, res) {
    const id = req.params.id;
    model.delete(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.changes === 0) return res.status(404).json({ error: "Garden not found" });
      res.json({ message: "Garden deleted" });
    });
  }
};
