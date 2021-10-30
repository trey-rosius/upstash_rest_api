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
module.exports.createPost = async (event) => {

    const timestamp = new Date().getTime();
    const postId = uuid.v1();
    const data = JSON.parse(event.body);
    if (data == null) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                    message: 'Couldn\'t create the Post item'

                },
                null,
                2
            ),
        };
    }

    console.log(`postId is ${postId}`);

    client.pipeline(

        await client.hmset(`postItem:${postId}`,
            "id", postId,
            "userId", data.userId,
            "postText", data.postText,
            "postImage", data.postImage,
            "createdOn", timestamp),
        await client.lpush('posts', postId),
        await client.lpush(`userPost:${data.userId}`, postId)
    )

    //get and display saved post item
    const postItem = await client.hgetall(`postItem:${postId}`);

    console.log(postItem);


    return {
        statusCode: 200,
        body: JSON.stringify(
            postItem
        ),

    };
};
