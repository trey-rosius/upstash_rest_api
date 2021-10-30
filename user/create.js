"use strict";
const uuid = require('uuid');
var Redis = require("ioredis");
const username = 'username';
const firstName = 'firstName';
const lastName = 'lastName';
const profilePic = 'profilePic';

if (typeof client === 'undefined') {
    var client = new Redis(process.env.REDIS_CLIENT);
}

/**
 * 
 * @param {username,firstName,lastName,profilePic} event 
 * @returns 
 */
module.exports.createUser = async (event) => {

    const timestamp = new Date().getTime();

    const data = JSON.parse(event.body);
    if (data == null) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                    message: 'Couldn\'t create the user item'

                },
                null,
                2
            ),
        };
    }



    const userId = uuid.v1();
    console.log(`userId is ${userId}`);
    // here, we use a pipeline to perform multiple requests
    // Firstly, we save the user details to a hash dataset with key (`userItem:${userId}`)
    //
    client.pipeline(

        await client.hmset(`userItem:${userId}`, "userId", userId, username, data.username,
            firstName, data.firstName, lastName, data.lastName, profilePic, data.profilePic,
            "timestamp", timestamp),
        await client.lpush('users', userId)
    )

    //get and display saved user item
    const userItem = await client.hgetall(`userItem:${userId}`);

    console.log(userItem);


    return {
        statusCode: 200,
        body: JSON.stringify(
            userItem
        ),

    };
};
