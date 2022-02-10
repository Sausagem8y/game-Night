const jwt = require("jsonwebtoken");
const Char = require("../char-info/character-model");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token);
    const char = await Char.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!char) {
      throw new Error();
    }

    req.token = token;
    req.char = char;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
