const mongoose = require("mongoose");

traitSchema = new mongoose.Schema({
  background: {
    type: String,
    required: true,
  },
  proficiency: {
    type: String,
  },
  languages: {
    type: String,
  },
  ideal: {
    type: String,
  },
  bond: {
    type: String,
  },
  flaw: {
    type: String,
  },
  alignment: {
    type: String,
  },
  cantrips: {
    type: String,
  },
  spells: {
    type: String,
  },
  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: "Char",
  // },
});

const trait = mongoose.model("Trait", traitSchema);

module.exports = trait;
