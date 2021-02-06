const express = require("express");
const router = express.Router();
const connection = require("../config");

router.post("/", (req, res) => {
  const { favorite_user_id, favorite_review_id } = req.body;
  connection.query(
    "INSERT INTO favorite(favorite_user_id, favorite_review_id) VALUES(?, ?)",
    [favorite_user_id, favorite_review_id],
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send("Il y a eu une erreur lors de votre enregistrement");
      } else {
        connection.query(
          "SELECT * FROM favorite WHERE favorite_id=?",
          results.insertId,
          (err2, results2) => {
            if (err2) {
              res.sendStatus(500);
            }
            res.status(201).json(results2[0]);
          }
        );
      }
    }
  );
});

module.exports = router;
