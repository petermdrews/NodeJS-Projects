const express = require("express");
const Favorite = require("../models/favorite.js");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user_id })
      .then((favorite) => {
        if (favorite) {
          //iterate through the array of campsites.
          req.body.forEach((camp) => {
            if (!favorite.campsites.includes(camp)) {
              favorite.campsites.push(camp);
            }
          });
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
          //if a campsite doesn't exist, push it into the campsites array
        } else {
          //create a new favorite document, then iterate and push the campsites
          Favorite.create({ user: req.user_id }).then((likedCampsite) => {
            req.body.forEach((camp) => {
              if (!likedCampsite.campsites.includes(camp)) {
                likedCampsite.campsites.push(camp);
              }
            });
            likedCampsite
              .save()
              .then((likedCampsite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(likedCampsite);
              })
              .catch((err) => next(err));
          });
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user_id })
      .then((deletedFavorite) => {
        if (deletedFavorite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(deletedFavorite);
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `GET operation not supported on /campsites/${req.params.campsiteId}`
    );
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user_id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((camp) => {
            if (!favorite.campsites.includes(camp)) {
              favorite.campsites.push(camp);
            }
          });
          favorite.save().then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application");
          });
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser)
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user_id }).then((favorite) => {});
  });

module.exports = favoriteRouter;
