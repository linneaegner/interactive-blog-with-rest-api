import { getPost } from "./api.js";
// importera sen getComments och updatePost

const postId = new URLSearchParams(window.location.search).get("postId");
const postContainer = document.getElementById("post-container");

async function start() {
    try {
        const post = await getPost(postId);
        console.log("post", post);
    } catch (error) {
        // Fixa så något visas i htmml typ "Post not found"
    }
}

start();