const express = require("express");
const router = express.Router();

const users = require("./users");
const movies = require("./movies");
const reviews = require("./reviews");

router.use("/users", users);
router.use("/movies", movies);
router.use("/reviews", reviews);

module.exports = router;
