"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = redis_1.createClient(`redis://${process.env.REDIS_HOST}`);
redisClient.on('error', (err) => {
    console.log('Error: ', err.message);
});
redisClient.on('connect', (err) => {
    console.log('Connected to redis.');
});
// console.log('redisClient :>> ', redisClient);
exports.default = redisClient;
