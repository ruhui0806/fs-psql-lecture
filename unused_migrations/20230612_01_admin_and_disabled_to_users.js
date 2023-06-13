const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: QueryInterface }) => {
    await QueryInterface.addColumn("users", "admin", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
    await QueryInterface.addColumn("users", "disabled", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
  },
  down: async ({ context: QueryInterface }) => {
    await QueryInterface.removeColumn("users", "admin");
    await QueryInterface.removeColumn("users", "disabled");
  },
};
