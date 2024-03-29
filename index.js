const express = require("express");
require("express-async-errors");
const app = express();
const { connectToDatabase } = require("./util/db");
const { PORT } = require("./util/config");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const middleware = require("./util/middleware");
app.use(express.json());

app.use("/api/login", loginRouter);
app.use(middleware.tokenExtractor);
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/logout", logoutRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHander);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();
