const config = require("./config");
const jwt = require("jsonwebtoken");
const { User, Session } = require("../models");
const { Op } = require("sequelize");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHander = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

// const tokenExtractor = (request, response, next) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     request.token = authorization.substring(7);
//     request.decodedToken = jwt.verify(request.token, config.SECRET);
//   }
//   return next();
// };

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const validToken = authorization.substring(7);
    console.log("valid token", { validToken });
    // let whereObj = {};
    // whereObj.token = { [Op.substring]: validToken };
    const tokenInSession = await Session.findOne({
      where: { token: validToken },
      // whereObj,
    });
    if (tokenInSession === null || !tokenInSession) {
      throw new Error("Token missing or invalid");
    }
    request.token = validToken;
    request.decodedToken = jwt.verify(request.token, config.SECRET);
  }
  return next();
};
const userExtractor = async (request, response, next) => {
  request.user = await User.findByPk(request.decodedToken.id);
  if (request.user.disabled) {
    throw new Error("Your user has been disabled.");
  }
  return next();
};

module.exports = {
  unknownEndpoint,
  errorHander,
  tokenExtractor,
  userExtractor,
};
