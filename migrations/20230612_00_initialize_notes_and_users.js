const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: QueryInterface }) => {
    await QueryInterface.createTable("notes", {
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
    });
    await QueryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usernames: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    await QueryInterface.addColumn("notes", "user_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "user", key: "id" },
    });
  },
  down: async ({ context: QueryInterface }) => {
    await QueryInterface.dropTable("notes");
    await QueryInterface.dropTable("users");
  },
};
