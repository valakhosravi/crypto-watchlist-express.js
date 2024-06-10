const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

router.post('/', watchlistController.saveWatchlist);
router.get('/:userId', watchlistController.getWatchlist);
router.get('/updates/:userId', watchlistController.getWatchlistUpdates);
router.get('/top-coins', watchlistController.getTopCoins);
router.get('/search', watchlistController.search);


module.exports = router;
