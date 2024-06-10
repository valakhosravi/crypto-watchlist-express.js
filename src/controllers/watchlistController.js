const redisClient = require('../services/redisClient');
const fetch = require('node-fetch');

exports.saveWatchlist = async (req, res) => {
    const { userId, coins } = req.body;
    try {
        const existingWatchlist = await redisClient.get(`watchlist:${userId}`);
        let updatedWatchlist = coins;

        if (existingWatchlist) {
            const parsedWatchlist = JSON.parse(existingWatchlist);
            updatedWatchlist = [...new Set([...parsedWatchlist, ...coins])];
        }

        await redisClient.set(`watchlist:${userId}`, JSON.stringify(updatedWatchlist));
        res.send({ message: 'Watchlist updated' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to save watchlist' });
    }
};


exports.getWatchlist = async (req, res) => {
    try {
        const watchlist = JSON.parse(await redisClient.get(`watchlist:${req.params.userId}`));
        if (!watchlist) {
            return res.status(404).send({ error: 'Watchlist not found' });
        }

        const ids = watchlist.join(',');
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`;
        const response = await fetch(url);
        const data = await response.json();

        res.send(data);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve watchlist' });
    }
};

exports.getWatchlistUpdates = async (req, res) => {
    try {
        const watchlist = JSON.parse(await redisClient.get(`watchlist:${req.params.userId}`));
        const ids = watchlist.join(',');
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
        const response = await fetch(url);
        const prices = await response.json();
        res.send(prices);
    } catch (error) {
        res.status(500).send({ error: 'Failed to get updates' });
    }
};

exports.search = async (req, res) => {
    const { query } = req.query;
    const url = `https://api.coingecko.com/api/v3/search?query=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch data' });
    }
};

exports.getTopCoins = async (req, res) => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch top coins data' });
    }
};
