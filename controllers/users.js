const router = require("express").Router();

const { User, Note, Team } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: [
      { model: Note, attributes: { exclude: ["userId"] } },
      { model: Team, attributes: ["name", "id"], through: { attributes: [] } },
    ],
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    // attributes: {exclude: [""]},
    include: [
      {
        model: Note,
        attributes: { exclude: ["userId"] },
      },
      {
        model: Note,
        as: "marked_notes",
        attributes: { exclude: ["userId"] },
        through: { attributes: [] },
      },
      {
        model: Team,
        attributes: ["name", "id"],
        through: { attributes: [] },
      },
    ],
  });
  if (user) {
    res.json(user);
    // res.json({
    //   username: user.username,
    //   name: user.name,
    //   note_count: user.notes.length,
    // });
  } else {
    res.status(404).end();
  }
});

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: "Operation is not allowed" });
  }
  next();
};

router.put("/:username", isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (user) {
    user.disabled = req.body.disabled;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});
module.exports = router;
