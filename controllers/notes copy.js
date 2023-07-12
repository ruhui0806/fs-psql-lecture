const router = require("express").Router();
const { Note, User } = require("../models");
const { Op } = require("sequelize");
const { userExtractor } = require("../util/middleware");

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);
  next();
};

// //ref: https: sequelize.org/docs/v6/core-concepts/model-querying-basics/#specifying-attributes-for-select-queries
// router.get("/", async (req, res) => {
//   if (req.query.important) {
//     const notes = await Note.findAll({
//       attributes: { exclude: ["userId"] },
//       include: { model: User, attributes: ["name"] },
//       where: { important: req.query.important === "true" },
//     });
//     res.json(notes);
//   } else {
//     const notes = await Note.findAll({
//       attributes: { exclude: ["userId"] },
//       include: { model: User, attributes: ["name"] },
//     });
//     res.json(notes);
//   }
// });

//optional:
router.get("/", async (req, res) => {
  let whereObj = {};
  // where.important = { [Op.in]: [true, false] };

  if (req.query.important) {
    whereObj.important = req.query.important === "true";
  }
  if (req.query.search) {
    whereObj.content = { [Op.substring]: req.query.search };
  }
  const notes = await Note.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where: whereObj,
  });
  res.json(notes);
});

//Sequelize provides the create method, which combines the build and save methods shown above into a single method:
//https://sequelize.org/docs/v6/core-concepts/model-instances/#a-very-useful-shortcut-the-create-method
router.post("/", userExtractor, async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user.id,
      date: new Date(),
    });
    res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

////op: without userExtractor
// router.post("/", async (req, res) => {
//   try {
//     const user = await User.findByPk(req.decodedToken.id);
//     const note = await Note.create({
//       ...req.body,
//       userId: user.id,
//       date: new Date(),
//     });
//     res.json(note);
//   } catch (error) {
//     return res.status(400).json({ error });
//   }
// });

// // opt without middleware function:
// router.get("/:id", async (req, res) => {
//   const note = await Note.findByPk(req.params.id);
//   if (note) {
//     res.json(note);
//   } else {
//     res.status(404).end();
//   }
// });

// opt with noteFinder middleware function:
router.get("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});

// // opt without middleware function:
// router.delete("/:id", async (req, res) => {
//   const note = await Note.findByPk(req.params.id);
//   if (note) {
//     await note.destroy();
//   }
//   res.status(204).end();
// });

router.delete("/:id", noteFinder, userExtractor, async (req, res) => {
  if (req.note && req.user.id === req.note.userId) {
    await req.note.destroy();
  } else {
    throw new Error("Only creator of the note can delete it");
  }
  res.status(204).end();
});

// // opt with noteFinder middleware function:
// router.delete("/:id", noteFinder, async (req, res) => {
//   if (req.note) {
//     await req.note.destroy();
//   }
//   res.status(204).end();
// });

// // opt without middleware function:
// router.put("/:id", async (req, res) => {
//   const note = await Note.findByPk(req.params.id);
//   if (note) {
//     note.important = req.body.important;
//     await note.save();
//     res.json(note);
//   } else {
//     res.status(404).end();
//   }
// });

// opt with noteFinder middleware function:
router.put("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important;
    await req.note.save();
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
