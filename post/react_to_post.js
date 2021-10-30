"use strict";
const uuid = require('uuid');
var Redis = require("ioredis");


if (typeof client === 'undefined') {
    var client = new Redis(process.env.REDIS_CLIENT);
}

/**
 * 
 * @param {userId,postId,postText,postImage,createdOn} event 
 * @returns 
 */
module.exports.reactToPost = async (event) => {

    const timestamp = new Date().getTime();

    const data = JSON.parse(event.body);
    const postId = event.pathParameters.id;

    if (data == null || postId == null) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                    message: 'Couldn\'t react to the Post'

                },
                null,
                2
            ),
        };
    }

    console.log(`postId is ${postId}`);
    console.log(`userId is ${data.userId}`);
    // first check if user has already liked the post
    const hasUserReacted = await client.zscore(`postReactions:${postId}`, data.userId);
    if (hasUserReacted == null) {
        //user hasn't reacted.
        client.pipeline(
            await client.incr(`postReactionsCount:${postId}`),
            await client.zadd(`postReactions:${postId}`, timestamp, data.userId),
            await client.hmset(`userPostReactions:${data.userId}`,
                "postId", postId,
                "userId", data.userId,
                "timestamp", timestamp
            ),

        )

    } else {
        //user already reacted, so unreact
        client.pipeline(
            await client.decr(`postReactionsCount:${postId}`),
            await client.zrem(`postReactions:${postId}`, data.userId),
            await client.hdel(`userPostReactions:${data.userId}`,
                "postId", postId,
                "userId", data.userId,
                "timestamp", timestamp
            ),

        )

    }




    //return the post reaction count
    const postReactionsCount = await client.get(`postReactionsCount:${postId}`);

    console.log(postReactionsCount);


    return {
        statusCode: 200,
        body: JSON.stringify({
            "postReactionCount": parseInt(postReactionsCount)
        }),

    };
};
