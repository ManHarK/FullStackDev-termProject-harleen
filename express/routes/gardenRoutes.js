const express = require("express");
const router = express.Router();
const controller = require("../controllers/gardenController");
const validate = require("../middleware/validate");

// GET all gardens
router.get("/", controller.getAll);

// GET one
router.get("/:id", controller.getOne);

// POST create
router.post("/", validate, controller.create);

// PUT update
router.put("/:id", validate, controller.update);

router.delete("/:id", controller.deleteGarden);

module.exports = router;

