const express = require("express");
const router = express.Router();
const uuid = require("uuid");

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

router.post("/", (req, res) => {
    res.send("User succesfully created")
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

router.put("/:id", (req, res) => {
    res.send("User updated")
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

router.put("/:id/:title", (req, res) => {
    res.send("Movie added to the favourites")
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

router.delete("/:id/:title", (req, res) => {
    res.send("Movie removed from the favourites")
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

router.delete("/:id", (req, res) => {
    res.send("User removed")
});

module.exports = router;