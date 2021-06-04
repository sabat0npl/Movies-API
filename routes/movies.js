const express = require("express"),
    router = express.Router(),
    uuid = require("uuid"),
    mongoose = require('mongoose'),
    Models = require('../js/models.js'),
    Movies = Models.Movie,
    Users = Models.User,
    passport = require('passport');
    require('../js/passport.js'); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - director
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the movie
 *         title:
 *           type: string
 *           description: The movie title
 *         description:
 *           type: string
 *           description: The movie description
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: List of genres the movie belongs to
 *         director:
 *           type: string
 *           description: The name of the movie director
 *         imageUrl:
 *           type: string
 *           description: Link to the movie image
 *         example:
 *           "id": "1"
 *           "title": "Harry Potter and the Sorcerer's Stone"
 *           "description": "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world."
 *           "genre": ["Adventure", "Family", "Fantasy"]
 *           "director": "Chris Columbus"
 *           "imageUrl": "https://www.imdb.com/title/tt0241527/mediaviewer/rm683213568/"
 */

/**
 * @swagger
 * tags:
 *   name: movies
 *   description: The movies managing API
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Returns the list of all the movies
 *     tags: [movies]
 *     responses:
 *       200:
 *         description: The list of the movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */

router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get the movie by id
 *     tags: [movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie id
 *     responses:
 *       200:
 *         description: The movie description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: The movie was not found
 */

router.get('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Movies.findById(req.params.id, (error, movie) => {
        console.log(movie)
        if (error) {
            console.error(error);
            res.status(500).send('Error: ' + error);
        } else {
            res.json(movie);
        }
    });
});

module.exports = router;