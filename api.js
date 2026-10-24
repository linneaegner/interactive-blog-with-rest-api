// Posts: https://dummyjson.com/docs/posts
// Comments: https://dummyjson.com/docs/comments
const API_URL = "https://dummyjson.com";


// index.html
export function getAllPosts() {} // GET
export function createPost(data) {} // POST
export function deletePost(id) {} // DELETE

// post.html
export function getPost(id) {} // GET
export function getComments(postId) {} // GET
export function updatePost(id, data) {} // PUT (eller PATCH)