let baseUrl = "https://dummyjson.com";

const postDetails = document.querySelector(".post-details");
const commentsList = document.querySelector(".comments-list");
const noComments = document.querySelector(".no-comments");
const errorMessage = document.querySelector(".error-message");

// read id from the address
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

// get post details from the API
async function getPostDetails() {
    try {
        const response = await fetch(`${baseUrl}/posts/${postId}`);
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        showPostDetails(data);
    } catch (error) {
        errorMessage.textContent = `Could not load post details: ${error.message}`;
    }
}

// show post details on the page
function showPostDetails(post) {
    postDetails.innerHTML = `
        <h2>${post.title}</h2>
        <p class="info">Written by user ${post.userId}</p> 
        <p>${post.body}</p>
        <p class="tags">Tags: ${post.tags.join(", ")}</p>
        <p class="info">👍 ${post.reactions.likes} 👎 ${post.reactions.dislikes} 👁 ${post.views}</p>
    `;
}

// get comments from the API
async function getComments() {
    try {
        const response = await fetch(`${baseUrl}/posts/${postId}/comments`);
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data.comments);
        showComments(data.comments);
    } catch (error) {
        errorMessage.textContent = `Could not load comments: ${error.message}`;
    }
}

// show comments on the page//?
function showComments(comments) {
    commentsList.innerHTML = "";

    if (comments.length === 0) {
        noComments.textContent = "No comments yet.";
        noComments.style.display = "block";
    } else {
         noComments.style.display = "none";  
        }
        for (const comment of comments) {
            addCommentsToPage(comment);
        }
           
}
function addCommentsToPage(comment) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <p class="info">Comment by user ${comment.userId}</p>
                <p>${comment.body}</p>
            `;
            commentsList.appendChild(card);
}


getPostDetails();
getComments();
