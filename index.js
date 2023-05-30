require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

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
