const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

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
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
    },
    //
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: { model: "user", key: "id" }, // model: "users" would also work
    // },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "note",
  }
);

module.exports = Note;
//underscored: true, which means that table names are derived from model names as plural snake case versions
