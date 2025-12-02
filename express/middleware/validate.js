// validations
module.exports = function (req, res, next) {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ error: "Name is required" });
  }

  if (!body.type) {
    return res.status(400).json({ error: "Type is required" });
  }

  if (!body.address) {
    return res.status(400).json({ error: "Address is required" });
  }


  // If everything looks okay
  next();
};
