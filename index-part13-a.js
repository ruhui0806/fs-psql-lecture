require("dotenv").config();
const { Sequelize, QueryTypes, DataTypes, Model } = require("sequelize");
const express = require("express");
const app = express();
app.use(express.json());
//Reference: https://sequelize.org/docs/v6/getting-started/

// Connecting to a database:
//Ref: https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor
const sequelize = new Sequelize(process.env.DATABASE_URL);

class Note extends Model {}
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "note",
  }
);
Note.sync();

//option1 using SQL:
app.get("/api/notes", async (req, res) => {
  const notes = await sequelize.query("SELECT * FROM notes", {
    type: QueryTypes.SELECT,
  });
  res.json(notes);
});
//option2 using Sequelize:
app.get("/api/notes", async (req, res) => {
  // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
  const notes = await Note.findAll();
  console.log(notes.map((n) => n.toJSON()));
  console.log(JSON.stringify(notes));
  res.json(notes);
});

app.get("/api/notes/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (note) {
    console.log(note.toJSON());
    res.json(note);
  } else {
    res.status(404).end();
  }
});
app.post("/api/notes", async (req, res) => {
  //
  try {
    // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-insert-queries
    const note = await Note.create(req.body);
    res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

//Option 2 for adding a new note:
app.post("/api/notes", async (req, res) => {
  try {
    console.log(req.body);
    const note = Note.build(req.body);
    note.important = true;
    await note.save();
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (note) {
    note.important = req.body.important;
    await note.save();
    res.json(note);
  } else {
    res.status(404).end();
  }
});

// The res.json() function sends a JSON response.
// This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using the JSON.stringify() method.

app.delete("/api/notes/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  Bl;
  if (note) {
    //  https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-delete-queries
    await Note.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});
// or:
app.delete("/api/notes/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  Bl;
  if (note) {
    //  https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-delete-queries
    await note.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
