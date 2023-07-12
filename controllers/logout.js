const { Session } = require("../models");
const router = require("express").Router();
const { userExtractor } = require("../util/middleware");

router.delete("/", userExtractor, async (req, res) => {
  const token = req.token;
  const tokenTobeDelete = await Session.destroy({ where: { token } });
  if (!tokenTobeDelete) {
    return res.status(404).json({ error: "Token not found" });
  }
  res.status(204).end();
});
module.exports = router;
