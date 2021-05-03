const express = require("express");
const router = express.Router();

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
 * /direcotrs:
 *   get:
 *     summary: Returns the list of all the directors
 *     tags: [directors]
 *     responses:
 *       200:
 *         description: The list of the directors
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Director'
 */

 router.get("/", (req, res) => {
    const movies = req.app.db.get("movies");
    directors = [];
    movies.forEach(element => { 
        element.genres.forEach(genre => {
            genres.includes(genre) ? null : genres.push(genre)
        })
        
    });

    res.send(genres);
});

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

router.get("/:name", (req, res) => {
    const movie = req.app.db.get("movies").find({
        genres: req.params.name
    }).value();

    if (!movie) {
        res.sendStatus(404)
    }

    res.send(movie);
});

module.exports = router;