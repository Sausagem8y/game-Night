const express = require("express");
const Trait = require("../char-info/character-traits");
const router = new express.Router();

module.exports = router;

router.post("/traits", async (req, res) => {
  const trait = new Trait({
    ...req.body,
    // owner: req.char._id,
  });
  try {
    await trait.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/traits", async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split("_");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    await req.char.populate({
      path: "traits",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.send(req.char.traits);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/traits/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const trait = await Trait.findOne({ _id, owner: req.char._id });

    if (!trait) {
      return res.status(404).send();
    }
    res.send(trait);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/traits/:id", async (req, res) => {
  try {
    const trait = await Trait.findOneAndDelete({
      _id: req.params.id,
      owner: req.char._id,
    });

    if (!trait) {
      return res.status(404).send();
    }

    res.send(trait);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/traits/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "background",
    "prodiciency",
    "languages",
    "ideal",
    "bond",
    "flaw",
    "alignment",
    "cantrips",
    "spells",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const trait = await Trait.findOneAndUpdate({
      _id: req.params.id,
      owner: req.trait._id,
    });

    if (!trait) {
      return res.status(404).send();
    }
    updates.forEach((update) => (trait[update] = req.body[update]));
    await trait.save();
    res.send(trait);
  } catch (e) {
    res.status(400).send(e);
  }
});
