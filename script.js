import { getAllPosts, addPost, deletePost } from "./api.js";

let posts = [];
const postsCatalog = document.getElementById("posts-catalog");
const addPostForm = document.getElementById("add-post-form");

function createPostCard(post) {
    const postCard = document.createElement("article");
    postCard.classList.add("post");
    postCard.innerHTML = `
        <h3 class="post-title">${post.title || "Unknown Title"}</h3>
        <p class="post-body">${post.body || "..."}</p>
        <div class="post-reactions">
            <p class="post-reaction-button like-button">👍 ${post.reactions.likes || 0}</p>
            <p class="post-reaction-button dislike-button">👎 ${post.reactions.dislikes || 0}</p>
        </div>
        <div class="post-footer">
            <a href="post.html?postId=${post.id}" class="view-post-link">Read more</a>
            <button class="delete-post-button">Delete</button>
        </div>
        <p class="delete-post-error-message hidden error-message">Could not delete post</p>
    `;
    return postCard;
}

function renderPosts(postsToRender) {
    postsCatalog.innerHTML = "";
    postsToRender.forEach(post => {
        const postCard = createPostCard(post);
        postsCatalog.appendChild(postCard);

        const deletePostButton = postCard.querySelector(".delete-post-button");

        deletePostButton.addEventListener("click", async () => {
            const postId = post.id;

            try {
                await deletePost(postId);
                posts = posts.filter(post => post.id !== postId);
                postCard.remove();
            } catch (error) {
                const deletePostError = postCard.querySelector(".delete-post-error-message");
                deletePostError.classList.remove("hidden");
                setTimeout(() => {
                    deletePostError.classList.add("hidden");
                }, 3000);
            }
        });

    });
}

addPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(addPostForm);
    const postContent = Object.fromEntries(formData);

    try {
        const newPost = await addPost(postContent);
        posts.push(newPost);

        renderPosts(posts);

        addPostForm.reset();
    } catch (error) {
        const addPostError = document.getElementById("add-post-error-message");
        addPostError.classList.remove("hidden");
        setTimeout(() => {
            addPostError.classList.add("hidden");
        }, 3000);
    }
});


async function start() {
    try {
        posts = await getAllPosts();
        renderPosts(posts);
    } catch (error) {
        postsCatalog.innerHTML = "<p>Could not load posts</p>";
    }
}

start();