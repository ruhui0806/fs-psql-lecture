const router = require("express").Router();

const { User, Note } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: { model: Note },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
