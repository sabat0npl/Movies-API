const express = require("express"),
    router = express.Router(),
    mongoose = require('mongoose'),
    Models = require('../js/models.js'),
    Movies = Models.Movie,
    Users = Models.User,
    passport = require('passport');
    require('../js/passport.js'); 

/**
 * @swagger
 * tags:
 *   name: directors
 *   description: The directors managing API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Director:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the direcotr
 *         name:
 *           type: string
 *           description: The direcotr name
 *         bio:
 *           type: string
 *           description: The director bio
 *         birth year:
 *           type: string
 *           description: The director birh year
 *         death year:
 *           type: string
 *           description: The director death year
 *         example:
 *           "id": "1"
 *           "name": "Phil Jackson"
 *           "bio": "Great basketball trainer"
 *           "birth year": "1945"
 *           "death year": "Alive"
 */

/**
 * @swagger
 * /directors/{name}:
 *   get:
 *     summary: Get the director by name
 *     tags: [directors]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The director name
 *     responses:
 *       200:
 *         description: The director description by name
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Director'
 *       404:
 *         description: The movie was not found
 */

router.get('/:name', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Movies.findOne({
            "Director.Name": req.params.name
        })
        .then((director) => {
            res.json(director.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

module.exports = router;