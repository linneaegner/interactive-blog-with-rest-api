import { getPost, getComments, addComment, updatePost } from "./api.js";

const postId = Number(new URLSearchParams(window.location.search).get("postId"));
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
            <p id="edit-post-error-message" class="hidden error-message"></p>
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
        const postUpdates = Object.fromEntries(formData);
        const editPostError = document.getElementById("edit-post-error-message");
        if (postUpdates.title === "" && postUpdates.body === "") {
            editPostError.textContent = "Fill in at least one field to edit the post";
            editPostError.classList.remove("hidden");
            setTimeout(() => {
                editPostError.classList.add("hidden");
            }, 3000);
            return;
        }

        try {
            const editedPost = await updatePost(postId, postUpdates);
            editPostForm.classList.add("hidden");
            renderPost(editedPost);
        } catch (error) {
            editPostError.textContent = "Could not edit post";
            editPostError.classList.remove("hidden");
            setTimeout(() => {
                editPostError.classList.add("hidden");
            }, 3000);
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
            <p id="add-comment-error-message" class="hidden error-message">Could not add comment</p>
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
            const addCommentError = document.getElementById("add-comment-error-message");
            addCommentError.classList.remove("hidden");
            setTimeout(() => {
                addCommentError.classList.add("hidden");
                }, 3000);
        }
    });
}


async function start() {

    try {
        const post = await getPost(postId);
        renderPost(post);
    } catch (error) {
        postContainer.innerHTML = `<p> Could not load post details</p>`;
        return;
    }

    try {
        comments = await getComments(postId);
        renderComments(comments);
    } catch (error) {
        commentsContainer.innerHTML = `<p> Could not load postcomments</p>`;
    }
}

start();