const { Model, DataTypes } = require("sequelize");

// const sequelize = new Sequelize(DATABASE_URL);
const { sequelize } = require("../util/db");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "user",
    defaultScope: {
      where: {
        disabled: false,
      },
    },
    scopes: {
      admin: {
        where: {
          admin: true,
        },
      },
      disabled: {
        where: {
          disabled: true,
        },
      },
    },
  }
);

module.exports = User;
//underscored: true, which means that table names are derived from model names as plural snake case versions
//scope: https://sequelize.org/docs/v6/other-topics/scopes/
