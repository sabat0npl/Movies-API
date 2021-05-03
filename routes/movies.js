const express = require("express");
const router = express.Router();
const uuid = require("uuid");

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

router.get("/", (req, res) => {
    const movies = req.app.db.get("movies");

    res.send(movies);
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

router.get("/:id", (req, res) => {
    const movie = req.app.db.get("movies").find({
        id: req.params.id
    }).value();

    if (!movie) {
        res.sendStatus(404)
    }

    res.send(movie);
});

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: The movie was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
    try {
        const movie = {
            id: uuid.v4(),
            ...req.body,
        };

        req.app.db.get("movies").push(movie).write();

        res.send(movie)
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * @swagger
 * /movies/{id}:
 *  put:
 *    summary: Update the movie by the id
 *    tags: [movies]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The movie id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Movie'
 *    responses:
 *      200:
 *        description: The movie was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Movie'
 *      404:
 *        description: The movie was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res) => {
    try {
        req.app.db
            .get("movies")
            .find({
                id: req.params.id
            })
            .assign(req.body)
            .write();

        res.send(req.app.db.get("movies").find({
            id: req.params.id
        }));
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Remove the movie by id
 *     tags: [movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie id
 * 
 *     responses:
 *       200:
 *         description: The movie was deleted
 *       404:
 *         description: The movie was not found
 */

router.delete("/:id", (req, res) => {
    req.app.db.get("movies").remove({
        id: req.params.id
    }).write();

    res.sendStatus(200);
});

module.exports = router;