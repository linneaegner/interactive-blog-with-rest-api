import { getAllPosts, createPost, deletePost } from "./api.js";

getAllPosts().then(posts => {
    console.log(posts);
});