const router = require("express").Router();
const { Note } = require("../models");

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  const notes = await Note.findAll();
  console.log(JSON.stringify(notes));
  res.json(notes);
});

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne();
    const note = await Note.create({ ...req.body, userId: user.id });
    res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

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

// opt with noteFinder middleware function:
router.delete("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    await req.note.destroy();
  }
  res.status(204).end();
});

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