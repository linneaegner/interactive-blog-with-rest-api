import { getAllPosts, addPost, deletePost } from "./api.js";

let posts = [];
const postsCatalog = document.getElementById("posts-catalog");
const addPostForm = document.getElementById("add-post-form");


function createPostCard(post) {
    const postCard = document.createElement("div");
    postCard.classList.add("post");
    postCard.innerHTML = `
        <h3 class="post-title">${post.title || "Unknown Title"}</h3>
        <p class="post-body">${post.body || "..."}</p>
        <div class="post-reactions">
            <p class="post-reaction-button like-button">👍 ${post.reactions.likes || 0}</p>
            <p class="post-reaction-button dislike-button">👎 ${post.reactions.dislikes || 0}</p>
        </div>
        <button class="delete-post-button">Delete</button>
        <a href="post.html?postId=${post.id}" class="view-post-link">Read more</a>
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
                // Fixa så användaren får ett meddelande
            }
        });

    });
}

addPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(addPostForm);
    const post = Object.fromEntries(formData);

    try {
        const newPost = await addPost(post);
        posts.push(newPost);

        renderPosts(posts);

        addPostForm.reset();
    } catch (error) {
        // Fixa så användaren får ett meddelande
    }
});


async function start() {
    try {
        posts = await getAllPosts();
        renderPosts(posts);
    } catch (error) {
        postsCatalog.textContent = "No posts found";
    }
}

start();