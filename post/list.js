"use strict";
var Redis = require("ioredis");


if (typeof client === 'undefined') {
    var client = new Redis(process.env.REDIS_CLIENT);
}


module.exports.getAllPosts = async (event) => {
    let posts = [];
    let response = await client.lrange('posts', 0, -1);

    async function getAllPosts() {
        let posts = [];

        await Promise.all(response.map(async (postId) => {
            const postItem = await client.hgetall(`postItem:${postId}`);
            const userItem = await client.hgetall(`userItem:${postItem.userId}`);
            postItem["postAdmin"] = userItem;
            posts.push(postItem);
            console.log(posts);
        }))

        return posts;

    }
    posts = await getAllPosts();


    return {
        statusCode: 200,
        body: JSON.stringify(
            posts
        ),

    };
};
