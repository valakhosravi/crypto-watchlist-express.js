const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Watchlist:
 *       type: object
 *       required:
 *         - userId
 *         - coins
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID
 *         coins:
 *           type: array
 *           items:
 *             type: string
 *           description: List of coin IDs
 */

/**
 * @swagger
 * tags:
 *   name: Watchlist
 *   description: API for managing user watchlists
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Save a user's watchlist
 *     tags: [Watchlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Watchlist'
 *     responses:
 *       200:
 *         description: Watchlist saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Watchlist saved
 *       500:
 *         description: Failed to save watchlist
 */
router.post('/user', watchlistController.saveWatchlist);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Retrieve a user's watchlist
 *     tags: [Watchlist]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user's watchlist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Failed to retrieve watchlist
 */
router.get('/user/:userId', watchlistController.getWatchlist);

/**
 * @swagger
 * /user/updates/{userId}:
 *   get:
 *     summary: Get price updates for a user's watchlist
 *     tags: [Watchlist]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The price updates for the user's watchlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to get updates
 */
router.get('/user/updates/:userId', watchlistController.getWatchlistUpdates);

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: API for searching cryptocurrencies
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for cryptocurrencies
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to fetch data
 */
router.get('/search', watchlistController.search);

/**
 * @swagger
 * tags:
 *   name: TopCoins
 *   description: API for retrieving top cryptocurrencies
 */

/**
 * @swagger
 * /top-coins:
 *   get:
 *     summary: Get the top cryptocurrencies by market cap
 *     tags: [TopCoins]
 *     responses:
 *       200:
 *         description: The top cryptocurrencies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Failed to fetch top coins data
 */
router.get('/top-coins', watchlistController.getTopCoins);

module.exports = router;
