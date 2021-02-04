const express = require("express");
const router = express.Router();
const connection = require("../config");

router.get("/", (req, res) => {
  connection.query("SELECT * from user", (err, results) => {
    if (err) {
      res
        .status(500)
        .send("Il y a eu une erreur lors de l'extraction des données");
    } else {
      if (results.length === 0) {
        res.status(404).send("Aucun utilisateur trouvé");
      } else {
        res.status(200).json(results);
      }
    }
  });
});

router.get("/:id", (req, res) => {
  connection.query(
    "SELECT * from user WHERE user_id=?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send("Il y a eu une erreur lors de l'extraction des données");
      } else {
        if (results.length === 0) {
          res.status(404).send("Aucun utilisateur trouvé");
        } else {
          res.status(200).json(results);
        }
      }
    }
  );
});

router.post("/", (req, res) => {
  const { user_name, user_email, user_password, user_avatar } = req.body;
  connection.query(
    "INSERT INTO user(user_name, user_email, user_password, user_avatar) VALUES(?, ?, ?, ?)",
    [user_name, user_email, user_password, user_avatar],
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send("Il y a eu une erreur lors de votre enregistrement");
      } else {
        connection.query(
          "SELECT * FROM user WHERE user_id=?",
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

router.put("/:id", (req, res) => {
  const updatedUser = req.body;
  const idUser = req.params.id;
  connection.query(
    "UPDATE user SET ? WHERE user_id=?",
    [updatedUser, idUser],
    (err, _) => {
      if (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la modification");
      } else {
        connection.query(
          "SELECT * from user WHERE user_id = ? ",
          req.params.id,
          (err2, results2) => {
            if (err2) {
              res.sendStatus(500);
            }
            res.status(200).json(results2[0]);
          }
        );
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  connection.query(
    "DELETE FROM user WHERE user_id=?",
    [req.params.id],
    (err, _) => {
      if (err) {
        res.status(500).send("Utilisateur non supprimé");
      } else {
        res.status(200).send("Utilisateur supprimé");
      }
    }
  );
});

module.exports = router;
