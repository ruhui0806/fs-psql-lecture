const express = require("express");
const app = express();
const { connectToDatabase } = require("./util/db");
const { PORT } = require("./util/config");
const notesRouter = require("./controllers/notes");

app.use(express.json());

app.use("/api/notes", notesRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();
