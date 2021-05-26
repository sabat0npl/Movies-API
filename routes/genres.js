const express = require("express"),
    router = express.Router(),
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
 * tags:
 *   name: genres
 *   description: The genres managing API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the movie
 *         name:
 *           type: string
 *           description: The genre name
 *         description:
 *           type: string
 *           description: The genre description
 *         example:
 *           "id": "1"
 *           "name": "Action"
 *           "description": "Movies in the action genre are defined by risk and stakes. While many movies may feature an action sequence, to be appropriately categorized inside the action genre, the bulk of the content must be action-oriented, including fight scenes, stunts, car chases, and general danger."
 */

/**
 * @swagger
 * /genres/{name}:
 *   get:
 *     summary: Get the genre by name
 *     tags: [genres]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The genre name
 *     responses:
 *       200:
 *         description: The genre description by name
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       404:
 *         description: The movie was not found
 */

router.get('/:name', (req, res) => {
    Movies.findOne({
            "Genre.Name": req.params.name
        })
        .then((genre) => {
            res.json(genre.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

module.exports = router;