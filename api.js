// API anrop och localStorage
const limit = 10;
const userId = 1;
const postsUrl = "https://dummyjson.com/posts";
const commentsUrl = "https://dummyjson.com/comments";




// index.html
export async function getAllPosts() {
    const storedPosts = localStorage.getItem("posts");

    if (storedPosts) {
        return JSON.parse(storedPosts);
    }

    try {
        const response = await fetch(`${postsUrl}?limit=${limit}`);

        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("posts", JSON.stringify(data.posts));

        return data.posts;

    } catch (error) {
        console.log("Error fetching posts:", error);
        throw error;
    }
}

export async function addPost(post) {
    try {
        const response = await fetch(`${postsUrl}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...post,
                userId,
                reactions: { likes: 0, dislikes: 0 },
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }

        const newPost = await response.json();

        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));


        return newPost;


    } catch (error) {
        console.log("Error creating post:", error);
        throw error;
    }
}
export async function deletePost(id) {
    try {
        const response = await fetch(`${postsUrl}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }

        const deletedPost = await response.json();

        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        const updatedPosts = posts.filter(post => post.id !== id);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));

        return deletedPost;
    } catch (error) {
        console.log("Error deleting post:", error);
        throw error;
    }
}

// // post.html
export async function getPost(id) {
    try {
        const response = await fetch(`${postsUrl}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }
        const post = await response.json();
        return post;
    } catch (error) {
        console.log("Error getting post:", error);
        throw error;
    }
}
// export function getComments(postId) {} // GET
// export function updatePost(id, data) {} // PUT (eller PATCH)