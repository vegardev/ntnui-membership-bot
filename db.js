const { Schema, default: mongoose } = require("mongoose");
const { DB_CONNECTION } = require("./config.json");
const moment = require("moment-timezone");
const dateOslo = moment.tz(Date.now(), "Europe/Oslo");

const membershipSchema = new Schema(
  {
    discord_id: { type: Number, unique: true },
    ntnui_no: { type: Number, unique: true },
    has_valid_group_membership: Boolean,
    ntnui_contract_expiry_date: String,
  },
  {
    id: true,
    strict: true,
    minimize: true,
    autoIndex: true,
    timestamps: true,
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Membership = mongoose.model("Membership", membershipSchema);

// Connect to the database
async function connectDB() {
  try {
    await mongoose.connect(DB_CONNECTION);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Call the connectDB function to establish the connection
connectDB();

module.exports = { Membership };
