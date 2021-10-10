"use strict";
var Redis = require("ioredis");


if (typeof client === 'undefined') {
    var client = new Redis(process.env.REDIS_CLIENT);
}


module.exports.getAllUsers = async (event) => {
    let users = [];
    let response = await client.lrange('users', 0, -1);

    async function getAllUsers() {
        let users = [];

        await Promise.all(response.map(async (userId) => {
            const item = await client.hgetall(`userItem:${userId}`);
            users.push(item);
            console.log(users);
        }))

        return users;

    }
    users = await getAllUsers();


    return {
        statusCode: 200,
        body: JSON.stringify(
            users
        ),

    };
};
