const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");
const Session = require("../models/session");

router.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });
  const passwordCorrect = body.password === "secret";
  //   const passwordCorrect = user === null ? false : body.password === "secret";

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  if (user.disabled) {
    return res
      .status(401)
      .json({ error: "Account disabled. Please contact admin." });
  }
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);
  console.log("save token to sessions: ", token);
  await Session.create({ token });
  res.status(200).send({ token, username: user.username, name: user.name });
});
module.exports = router;
