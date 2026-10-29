// API anrop och localStorage
const limit = 10;
const userId = 1;
const postsUrl = "https://dummyjson.com/posts";
const commentsUrl = "https://dummyjson.com/comments";



function getPostsFromLocalStorage() {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
        return JSON.parse(storedPosts);
    }
    return [];
}

function savePostsToLocalStorage(posts) {
    localStorage.setItem("posts", JSON.stringify(posts));
}


// index.html
export async function getAllPosts() {
    const postsFromStorage = getPostsFromLocalStorage();
    if (postsFromStorage.length > 0) {
        return postsFromStorage;
    }


    try {
        const response = await fetch(`${postsUrl}?limit=${limit}`);

        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }

        const data = await response.json();
        const postsFromApi = data.posts;
        savePostsToLocalStorage(postsFromApi);

        return postsFromApi;

    } catch (error) {
        console.log("Error fetching posts:", error);
        throw error;
    }
}

export async function addPost(postContent) {
    try {
        const response = await fetch(`${postsUrl}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...postContent,
                userId,
                reactions: { likes: 0, dislikes: 0 },
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }

        const newPost = await response.json();

        const postsFromStorage = getPostsFromLocalStorage();
        const updatedPosts = [...postsFromStorage, newPost];
        savePostsToLocalStorage(updatedPosts);


        return newPost;


    } catch (error) {
        console.log("Error creating post:", error);
        throw error;
    }
}
export async function deletePost(postId) {
    try {
        const response = await fetch(`${postsUrl}/${postId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }

        const deletedPost = await response.json();

        const postsFromStorage = getPostsFromLocalStorage();
        const updatedPosts = postsFromStorage.filter(post => post.id !== postId);
        savePostsToLocalStorage(updatedPosts);

        return deletedPost;
    } catch (error) {
        console.log("Error deleting post:", error);
        throw error;
    }
}

// post.html
export async function getPost(postId) {
    const postsFromStorage = getPostsFromLocalStorage();
    const postFromStorage = postsFromStorage.find(post => post.id === postId);
    if (postFromStorage) {
        return postFromStorage;
    }

    try {
        const response = await fetch(`${postsUrl}/${postId}`);
        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }
        const postFromApi = await response.json();
        return postFromApi;
    } catch (error) {
        console.log("Error getting post:", error);
        throw error;
    }
}

export async function updatePost(postId, postUpdates) {
    const bodyToSend = {};
    if (postUpdates.title !== "") bodyToSend.title = postUpdates.title;
    if (postUpdates.body !== "") bodyToSend.body = postUpdates.body;

    const method = (bodyToSend.title && bodyToSend.body) ? "PUT" : "PATCH";

    try {
            const response = await fetch(`${postsUrl}/${postId}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyToSend),
            });
            console.log(bodyToSend)
            console.log(method)
            if (!response.ok) {
                throw new Error(`HTTP-fel: ${response.status}`);
            }
            const editedPost = await response.json();
            console.log("editedPost", editedPost);

            const postsFromStorage = getPostsFromLocalStorage();
            
            const updatedPosts = postsFromStorage.map(post => post.id === postId ? editedPost : post);
            savePostsToLocalStorage(updatedPosts);
            

            return editedPost;
        } catch (error) {
            console.log("Error editing post:", error);
            throw error;
        }
}


export async function getComments(postId) {
    try {
        const response = await fetch(`${postsUrl}/${postId}/comments`);
        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }
        const data = await response.json();
        const comments = data.comments;
        return comments;
    } catch (error) {
        console.log("Error getting comments:", error);
        throw error;
    }
}
export async function addComment(commentText, postId) {
    try {
        const response = await fetch(`${commentsUrl}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                body: commentText,
                userId,
                postId
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }
        const addedComment = await response.json();
        return addedComment;
    } catch (error) {
        console.log("Error adding comment:", error);
        throw error;
    }
}