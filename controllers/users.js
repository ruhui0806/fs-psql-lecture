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

//eager loading:
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
// lazy loading:
router.get("/lazy/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [""] },
    include: [
      {
        model: Note,
        attributes: { exclude: ["userId"] },
      },
      {
        model: Note,
        as: "marked_notes",
        attributes: { exclude: ["userId"] },
        through: {
          attributes: [],
        },
        include: {
          model: User,
          attributes: ["name"],
        },
      },
    ],
  });
  if (!user) {
    return res.status(404).end();
  }

  let teams = undefined;

  if (req.query.teams) {
    teams = await user.getTeams({
      attributes: ["name"],
      joinTableAttributes: [],
    });
  }

  res.json({ ...user.toJSON(), teams });
});

//https://sequelize.org/docs/v6/core-concepts/assocs/#fetching-associations---eager-loading-vs-lazy-loading
// example of lazy loading: http://localhost:3001/api/users/lazy/1?teams=something : show the teams info
//http://localhost:3001/api/users/lazy/1: fetch info without teams

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
