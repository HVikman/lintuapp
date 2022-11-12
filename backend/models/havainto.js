const mongoose = require("mongoose");

const havaintoSchema = mongoose.Schema({
  laji: { type: String, required: true },
  maara: { type: String, required: true },
  paikkakunta: { type: String, required: true },
  date: { type: String, required: true },
  info: { type: String },
  osoite: { type: String },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Havainto", havaintoSchema);
