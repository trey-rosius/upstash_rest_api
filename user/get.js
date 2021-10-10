"use strict";
var Redis = require("ioredis");


if (typeof client === 'undefined') {
    var client = new Redis(process.env.REDIS_CLIENT);
}


module.exports.getUserById = async (event) => {

    const userId = event.pathParameters.id;

    if (userId == null) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                    message: 'Couldn\'t get the user item'

                },
                null,
                2
            ),
        };
    }

    console.log(`userId is ${userId}`);

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
