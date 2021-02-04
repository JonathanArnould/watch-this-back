const express = require("express");
const router = express.Router();
const connection = require("../config");

router.get("/", (req, res) => {
  connection.query("SELECT * from movie", (err, results) => {
    if (err) {
      res
        .status(500)
        .send("Il y a eu une erreur lors de l'extraction des données");
    } else {
      if (results.length === 0) {
        res.status(404).send("Aucun film trouvé");
      } else {
        res.status(200).json(results);
      }
    }
  });
});

module.exports = router;
