const mongoose = require("mongoose");
const Trait = require("./character-traits");
const jwt = require("jsonwebtoken");

const charSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  race: {
    type: String,
    required: true,
    trim: true,
  },
  const: {
    type: Number,
  },
  dex: {
    type: Number,
  },
  str: {
    type: Number,
  },
  wis: {
    type: Number,
  },
  cam: {
    type: Number,
  },
  int: {
    type: Number,
  },
  personality: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
    trim: true,
  },
  equipment: {},
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

charSchema.virtual("traits", {
  ref: "Trait",
  localField: "_id",
  foreignField: "owner",
});

charSchema.methods.toJSON = function () {
  const char = this;
  const charObject = char.toObject();

  delete charObject.tokens;

  return charObject;
};

charSchema.methods.generateToken = async function () {
  const char = this;
  const token = jwt.sign({ _id: char._id.toString() });

  char.tokens = char.tokens.concat({ token });
  await char.save();

  return token;
};

charSchema.statics.findByCredentials = async (name) => {
  const char = await Char.findOne({ name });

  if (!char) {
    throw new Error("Unable to find character!");
  }

  return char;
};

charSchema.pre("remove", async function (next) {
  const char = this;
  await Trait.deleteMany({ owner: char._id });
  next();
});

const Char = mongoose.model("Char", charSchema);

module.exports = Char;
