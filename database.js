const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "database.sqlite",
});

const DiscordNTNUIPairs = sequelize.define("DiscordNTNUIPairs", {
  discord_id: {
    type: Sequelize.INTEGER,
    unique: true,
  },
  ntnui_no: { type: Sequelize.INTEGER, unique: true },
  has_valid_group_membership: { type: Sequelize.BOOLEAN },
  group_expiry: { type: Sequelize.STRING },
});

module.exports = { DiscordNTNUIPairs };
