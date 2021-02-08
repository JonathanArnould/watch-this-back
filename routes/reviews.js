const express = require("express");
const router = express.Router();
const connection = require("../config");

router.get("/", (req, res) => {
  connection.query(
    "SELECT * FROM review JOIN movie ON movie.movie_id=review_movie_id JOIN user ON user.user_id=review_user_id ORDER BY review_id DESC",
    (err, results) => {
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
    }
  );
});

router.get("/:id", (req, res) => {
  connection.query(
    "SELECT * FROM review WHERE review_id=?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send("Il y a eu une erreur lors de l'extraction des données");
      } else {
        if (results.length === 0) {
          res.status(404).send("Aucune critique trouvée");
        } else {
          res.status(200).json(results);
        }
      }
    }
  );
});

router.post("/", (req, res) => {
  const {
    review_title,
    review_text,
    review_image,
    review_user_id,
    review_movie_id,
  } = req.body;
  connection.query(
    "INSERT INTO review(review_title, review_text, review_image, review_user_id, review_movie_id) VALUES(?, ?, ?, ?, ?)",
    [review_title, review_text, review_image, review_user_id, review_movie_id],
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send("Il y a eu une erreur lors de votre enregistrement");
      } else {
        connection.query(
          "SELECT * FROM review WHERE review_id=?",
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
