const { createClient } = require('redis');

// Create a Redis client (default: localhost:6379)
const redisClient = createClient();

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

redisClient.connect()
    .then(() => console.log('Connected to Redis server!'))
    .catch((err) => console.error('Failed to connect to Redis:', err));

module.exports = redisClient;
