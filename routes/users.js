const express = require("express"),
  router = express.Router(),
  uuid = require("uuid"),
  mongoose = require('mongoose'),
  Models = require('../js/models.js'),
  Movies = Models.Movie,
  Users = Models.User,
  passport = require('passport'),
  {
    check,
    validationResult
  } = require('express-validator');
require('../js/passport.js');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - Username
 *         - Password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         Username:
 *           type: string
 *           description: The username
 *         Password:
 *           type: string
 *           description: The user password
 *         Email:
 *           type: string
 *           description: The user email
 *         Favourites:
 *           type: array
 *           items:
 *             type: ObjectID
 *           description: List of the user favourites movies
 *         example:
 *           "id": "1"
 *           "title": "BarryG"
 *           "Email": "asd@asd.com" 
 *           "password": "*********"
 *           "Favourites": ["60968b6a89e5eb26cad30bca", "60968b6a89e5eb2asdd30bca"]
 */

/**
 * @swagger
 * tags:
 *   name: users
 *   description: The users managing API
 */

// Get a user by username
router.get('/:Username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOne({
      Username: req.params.Username
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

router.post('/',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({
      min: 5
    }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({
        Username: req.body.Username
      }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => {
              res.status(201).json(user)
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

/**
 * @swagger
 * /users/{name}:
 *  put:
 *    summary: Update the user by the name
 *    tags: [users]
 *    parameters:
 *      - in: path
 *        name: name
 *        schema:
 *          type: string
 *        required: true
 *        description: The username
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The User was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

router.put('/:Username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    }, {
      new: true
    }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
 * @swagger
 * /users/{name}{id}:
 *  put:
 *    summary: Update the user favourites by the name and title
 *    tags: [users]
 *    parameters:
 *      - in: path
 *        name: name
 *        title: title 
 *        schema:
 *          type: string
 *        required: true
 *        description: The username
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The User was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

// Add a movie to a user's list of favorites
router.post('/:Username/:MovieID', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $push: {
        Favourites: req.params.MovieID
      }
    }, {
      new: true
    }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
 * @swagger
 * /users/{name}{title}:
 *  delete:
 *    summary: Delets the movies from user favourites by the title
 *    tags: [users]
 *    parameters:
 *      - in: path
 *        name: name
 *        title: title 
 *        schema:
 *          type: string
 *        required: true
 *        description: The username
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The User was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

router.delete('/:Username/:MovieID', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $pull: {
        Favourites: req.params.MovieID
      }
    }, {
      new: true
    }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
 * @swagger
 * /users/{name}:
 *   delete:
 *     summary: Remove the user by name
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The username
 * 
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

// Delete a user by username
router.delete('/:Username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndRemove({
      Username: req.params.Username
    })
    .then((user) => {
      if (!user) {
        res.status(409).send(req.params.Username + ' was not found.');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


module.exports = router;