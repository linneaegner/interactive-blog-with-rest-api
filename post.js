import { getPost, getComments, addComment, editPost } from "./api.js";

const postId = new URLSearchParams(window.location.search).get("postId");
const postContainer = document.getElementById("post-container");
const commentsContainer = document.getElementById("comments-container");
let comments = [];

function renderPost(post) {
    postContainer.innerHTML = `
        <h1 class="margin-2rem">${post.title}</h1>
        <p>${post.body}</p>

        <button type="button" id="edit-post-button">✏️ Edit</button>

        <form id="edit-post-form" class="hidden">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" placeholder="Title">

            <label for="body">Body</label>
            <textarea name="body" id="body" placeholder="Body"></textarea>

            <button type="submit">Save changes</button>
        </form>

    `;

    const editPostButton = document.getElementById("edit-post-button");
    const editPostForm = document.getElementById("edit-post-form");
    editPostButton.addEventListener("click", () => {
        editPostForm.classList.toggle("hidden");
    });
    editPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(editPostForm);
        const post = Object.fromEntries(formData);
        try {
            const editedPost = await editPost(postId, post);
            editPostForm.classList.add("hidden");
            renderPost(editedPost);
        } catch (error) {
            // Felmeddelande för användarenn
        }
    });

}

function createCommentItem(comment) {
    const commentItem = document.createElement("li");
    console.log(comment);
    commentItem.innerHTML = `
        <p><strong>Comment:</strong></p>
        <p>${comment.body}</p>
        <p>Posted by ${comment.user?.username || "Unknown user"}</p>
    `;
    return commentItem;
}

function renderComments(comments) {
    commentsContainer.innerHTML = `
        <h2 class="margin-2rem">Comments</h2>
        <ul id="comments-list"></ul>
        <form id="comment-form">
            <textarea name="body" placeholder="Add a comment"></textarea>
            <button type="submit">Add comment</button>
        </form>
    `;


    const commentsList = document.getElementById("comments-list");
    comments.forEach(comment => {
        commentsList.appendChild(createCommentItem(comment));
    });


    const commentForm = document.getElementById("comment-form");
    commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(commentForm);
        const commentText = formData.get("body");

        try {
            const addedComment = await addComment(commentText, postId);
            comments.push(addedComment);
            renderComments(comments);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    });
}


async function start() {
    try {
        const post = await getPost(postId);
        comments = await getComments(postId);
        renderPost(post);
        renderComments(comments);
    } catch (error) {
        postContainer.textContent = "Post not found";
    }
}

start();