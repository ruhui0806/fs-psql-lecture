require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");
const express = require("express");
const app = express();
//Reference: https://sequelize.org/docs/v6/getting-started/

// Connecting to a database:
const sequelize = new Sequelize(process.env.DATABASE_URL);

// Testing the connection:
const main = async () => {
  try {
    await sequelize.authenticate();
    const notes = await sequelize.query("SELECT * FROM notes", {
      type: QueryTypes.SELECT,
    });
    console.log("Connection has been established successfully.");
    console.log(notes);
    sequelize.close();
  } catch (err) {
    console.err("Unable to connect to the database: " + err);
  }
};
main();
