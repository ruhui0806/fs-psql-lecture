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
app.get("/api/notes", async (req, res) => {
  //   const notes = await sequelize.query("SELECT * FROM notes", {
  //     type: QueryTypes.SELECT,
  //   });
  console.log(req.body);
  const notes = await Note.findAll();
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  try {
    console.log(req.body);
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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
