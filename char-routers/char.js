const express = require("express");
const Char = require("../char-info/character-model");
const router = new express.Router();
const auth = require("../middleware2/auth");

module.exports = router;

router.post("/chars", async (req, res) => {
  const char = new Char(req.body);

  try {
    await char.save();
    const token = await char.generateToken();
    res.status(201).send({ char, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/chars/login", async (req, res) => {
  try {
    const char = await Char.findByCredentials(req.body.name);
    const token = await user.generateToken();
    res.send({ char, token });
    console.log({ char, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/chars/logoutAll", auth, async (req, res) => {
  try {
    req.char.tokens = [];
    await req.char.save();
    console.log(req.char.tokens);
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/chars/me", auth, async (req, res) => {
  res.send(req.char);
  console.log(req.char);
});

router.get("/chars/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const char = await Char.findById(_id);

    if (!char) {
      return res.status(404).send();
    }

    res.send(char);
    console.log("line 47");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/chars/:id", async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const char = await Char.findByIdAndUpdate(req.params.id, req.body);

  try {
    if (!char) {
      return res.status(404).send();
    }

    // char.body.value = req.body.value;
    // updates.forEach((update) => (req.char[update] = req.body[update]));

    await char.save();
    res.send(char);
  } catch (e) {
    res.status(500).send(e);
  }
});

// router.patch("/chars/me", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = [
//     "name",
//     "race",
//     "personality",
//     "height",
//     "weight",
//     "equipment",
//   ];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates!" });
//   }
//   try {
//     updates.forEach((update) => (req.char[update] = req.body[update]));

//     await req.char.save();

//     res.send(req.char);
//   } catch (e) {
//     console.log("error " + e);
//     res.status(400).send(e);
//   }
// });

router.delete("/chars/me", auth, async (req, res) => {
  try {
    const char = await Char.findByIdAndDelete(req.char._id);

    await req.char.remove();
    res.send(req.char);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/chars/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const char = await Char.findByIdAndDelete(_id);

    if (!char) {
      return res.status(404).send();
    }

    res.send(char);
    console.log("line 47");
  } catch (e) {
    res.status(500).send(e);
  }
});
