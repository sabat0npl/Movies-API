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
 * /directors:
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
    res.send("The list of all directors");
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
    res.send("Direcotr page");
});

module.exports = router;