"use strict";
var Redis = require("ioredis");


if (typeof client === 'undefined') {
    var client = new Redis(process.env.REDIS_CLIENT);
}


module.exports.getPostById = async (event) => {

    const postId = event.pathParameters.id;
    if (postId == null) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                    message: 'Couldn\'t get the post item'

                },
                null,
                2
            ),
        };
    }

    console.log(`postId is ${postId}`);

    //get and display saved post item
    const postItem = await client.hgetall(`postItem:${postId}`);
    const userItem = await client.hgetall(`userItem:${postItem.userId}`);
    const postReactionsCount = await client.get(`postReactionsCount:${postId}`);
    postItem["postAdmin"] = userItem;
    postItem["reactionCount"] = postReactionsCount == null ? 0 : parseInt(postReactionsCount);
    console.log(postItem);
    console.log(userItem);


    return {
        statusCode: 200,
        body: JSON.stringify(
            postItem
        ),

    };
};
