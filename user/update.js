"use strict";
const uuid = require('uuid');
var Redis = require("ioredis");
const username = 'username';
const firstName = 'firstName';
const lastName = 'lastName';
const age = 'age';
const profilePic = 'profilePic';

if (typeof client === 'undefined') {
    var client = new Redis(process.env.REDIS_CLIENT);
}

/**
 * 
 * @param {username,firstName,lastName,age,profilePic} event 
 * @returns 
 */
module.exports.updateUser = async (event) => {

    const timestamp = new Date().getTime();
    const userId = event.pathParameters.id;
    const data = JSON.parse(event.body);
    if (userId == null) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                    message: 'Couldn\'t update the user item'

                },
                null,
                2
            ),
        };
    }

    //get


    await client.hmset(`userItem:${userId}`, username, data.username,
        firstName, data.firstName, lastName, data.lastName,
    );

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
