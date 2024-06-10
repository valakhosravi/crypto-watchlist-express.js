const Redis = require('redis');

const redisClient = Redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD
});

redisClient.connect()
    .then(() => console.log("🚀 redis db connected"))
    .catch(err => console.error("❌ Redis connection failed", err));

module.exports = redisClient;
