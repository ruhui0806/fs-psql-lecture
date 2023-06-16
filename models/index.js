const Note = require("./note");
const User = require("./user");
const Team = require("./team");
const Membership = require("./membership");

User.hasMany(Note);
Note.belongsTo(User);

User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });
//  https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
//  https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships
// Note.sync({ alter: true });
// User.sync({ alter: true });

module.exports = {
  Note,
  User,
  Team,
  Membership,
};
