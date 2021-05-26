const express = require("express"),
  router = express.Router(),
  uuid = require("uuid"),
  mongoose = require('mongoose'),
  Models = require('../js/models.js'),
  Movies = Models.Movie,
  Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The username
 *         password:
 *           type: string
 *           description: The user password
 *         favourites:
 *           type: array
 *           items:
 *             type: string
 *           description: List of the user favourites movies
 *         example:
 *           "id": "1"
 *           "title": "BarryG"
 *           "password": "*********"
 *           "favourites": "[Nemo Nobody, Harry Potter, Lord of The Rings"
 */

/**
 * @swagger
 * tags:
 *   name: users
 *   description: The users managing API
 */

// Get a user by username
router.get('/:Username', (req, res) => {
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

router.post('/', (req, res) => {
  Users.findOne({
      Username: req.body.Username
    })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
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

router.put('/:Username', (req, res) => {
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
 * /users/{name}{title}:
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
router.post('/:Username/Movies/:MovieID', (req, res) => {
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

router.post('/:Username/Movies/:MovieID', (req, res) => {
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
router.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({
      Username: req.params.Username
    })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
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