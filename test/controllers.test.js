const request = require('supertest');
const app = require('../src/app'); // Adjust the path to your app.js

// Mock Redis client
jest.mock('../src/services/redisClient', () => {
    const mClient = {
        get: jest.fn(),
        set: jest.fn(),
        connect: jest.fn().mockResolvedValue(),
    };
    return mClient;
});

const redisClient = require('../src/services/redisClient');

// Mock fetch
jest.mock('node-fetch');
const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('Watchlist API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should save a new watchlist', async () => {
        redisClient.get.mockResolvedValue(null);
        redisClient.set.mockResolvedValue('OK');

        const response = await request(app)
            .post('/user')
            .send({ userId: 'user1', coins: ['bitcoin', 'ethereum'] });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Watchlist updated');
        expect(redisClient.get).toHaveBeenCalledWith('watchlist:user1');
        expect(redisClient.set).toHaveBeenCalledWith('watchlist:user1', JSON.stringify(['bitcoin', 'ethereum']));
    });

    it('should add to an existing watchlist', async () => {
        redisClient.get.mockResolvedValue(JSON.stringify(['bitcoin']));
        redisClient.set.mockResolvedValue('OK');

        const response = await request(app)
            .post('/user')
            .send({ userId: 'user1', coins: ['ethereum'] });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Watchlist updated');
        expect(redisClient.get).toHaveBeenCalledWith('watchlist:user1');
        expect(redisClient.set).toHaveBeenCalledWith('watchlist:user1', JSON.stringify(['bitcoin', 'ethereum']));
    });

    it('should retrieve a watchlist with full data', async () => {
        const mockWatchlist = ['bitcoin', 'ethereum'];
        redisClient.get.mockResolvedValue(JSON.stringify(mockWatchlist));
        const mockData = [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 50000 },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 4000 }
        ];
        fetch.mockResolvedValue(new Response(JSON.stringify(mockData)));

        const response = await request(app).get('/user/user1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(redisClient.get).toHaveBeenCalledWith('watchlist:user1');
    });

    it('should get watchlist updates', async () => {
        const mockWatchlist = ['bitcoin', 'ethereum'];
        redisClient.get.mockResolvedValue(JSON.stringify(mockWatchlist));
        const mockPrices = {
            bitcoin: { usd: 50000 },
            ethereum: { usd: 4000 }
        };
        fetch.mockResolvedValue(new Response(JSON.stringify(mockPrices)));

        const response = await request(app).get('/user/user1/updates');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPrices);
        expect(redisClient.get).toHaveBeenCalledWith('watchlist:user1');
    });

    it('should search for cryptocurrencies', async () => {
        const mockData = { coins: [{ id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' }] };
        fetch.mockResolvedValue(new Response(JSON.stringify(mockData)));

        const response = await request(app).get('/search?query=bitcoin');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
    });

    it('should get top coins', async () => {
        const mockData = [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 50000 },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 4000 }
        ];
        fetch.mockResolvedValue(new Response(JSON.stringify(mockData)));

        const response = await request(app).get('/top-coins');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
    });

    it('should get top coins with pagination', async () => {
        const mockData = [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 50000 },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 4000 }
        ];
        fetch.mockResolvedValue(new Response(JSON.stringify(mockData)));

        const response = await request(app).get('/top-coins?page=2');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
    });
});
