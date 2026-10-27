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
        const posts = data.posts;
        localStorage.setItem("posts", JSON.stringify(posts));

        return posts;

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

// post.html
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

export async function editPost(postId, post) {
    try {
        const response = await fetch(`${postsUrl}/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });
        if (!response.ok) {
            throw new Error(`HTTP-fel: ${response.status}`);
        }
        const editedPost = await response.json();
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


//TODO nästa gång:
// Felmeddelande för användaren i gränssnittet vid api anropen
// Kan jag spara mer till lokal storage och använda? t.ex. kanske jag borde uppdatera posts på index sidan när jag redigerar rubrik och innehåll?
// Kollar alla HTTP anrop med reesponse.ok? (krav för g)
// ÄR alla hanteringar med try/catch throw error rätt?
// Är det responsivt mobil, padda, desktop?fixa lite i CSS så de blir snyggare med formulären och stilen överlag
// Kolla kraven för VG och fixa dem
// Kolla hur vi löst liknande upgifter i skolan om de finns bättre sätt att göra saker på. har jag async/await rätt
// Läs på mer om destructuring och hur man kan använda det i JavaScript