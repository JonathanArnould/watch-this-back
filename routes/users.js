const express = require("express");
const router = express.Router();
const connection = require("../config");
const { check } = require("express-validator");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const dataUser = {
    user_email: req.body.user_email,
    user_password: req.body.user_password,
  };
  connection.query(
    "SELECT * FROM user WHERE user_email = ?",
    [dataUser.user_email],
    (err, results) => {
      if (err) {
        res.sendStatus(500).send("E-mail incorrecte");
      } else {
        const goodPassword = bcrypt.compareSync(
          dataUser.user_password,
          results[0].user_password
        );
        if (goodPassword) {
          jwt.sign({ results }, process.env.SECRET_KEY_JWT, (err, token) => {
            res.json({ token });
          });
        } else {
          res.sendStatus(500);
        }
      }
    }
  );
});

router.post("/profil", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY_JWT, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
}

// RECUPERE LES INFOS DE TOUT LES UTILISATEURS

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

// RECUPERE LES INFOS D'UN UTILISATEUR

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

// RECUPERE TOUTES LES CRITIQUES FAVORITES D'UN UTILISATEUR

router.get("/:id/favorites", (req, res) => {
  connection.query(
    "SELECT * FROM review AS r LEFT JOIN favorite AS f ON r.review_id=f.favorite_review_id LEFT JOIN user AS u ON u.user_id=f.favorite_user_id WHERE u.user_id=?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send("Il y a eu une erreur lors de l'extraction des données");
      } else {
        if (results.length === 0) {
          res.status(404).send("Aucun favori trouvé");
        } else {
          res.status(200).json(results);
        }
      }
    }
  );
});

// POST D'UN UTILISATEUR

/* router.post("/", (req, res) => {
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
}); */

const userValidationMiddlewares = [
  // email must be valid
  check("user_email").isEmail(),
  // password must be at least 8 chars long
  check("user_password").isLength({ min: 8 }),
  // let's assume a name should be 2 chars long
  check("user_name").isLength({ min: 2 }),
];

router.post("/", userValidationMiddlewares, (req, res) => {
  const hash = bcrypt.hashSync(req.body.user_password, 10);

  const formData = {
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_password: hash,
    user_avatar: req.body.user_avatar,
  };
  connection.query("INSERT INTO user SET ?", formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de l'enregistrement des données");
    } else {
      connection.query(
        "SELECT * FROM user WHERE user_id = ?",
        [results.insertId],
        (err2, results2) => {
          if (err2) {
            res.sendStatus(500);
          } else {
            res.status(200).json(results2[0]);
          }
        }
      );
    }
  });
});

// MODIFICATION DES DONNEES D'UN UTILISATEUR

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

// SUPPRESSION D'UN UTILISATEUR

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
