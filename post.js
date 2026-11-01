let baseUrl = "https://dummyjson.com";

const postDetails = document.querySelector(".post-details");
const commentsList = document.querySelector(".comments-list");
const noComments = document.querySelector(".no-comments");
const errorMessage = document.querySelector(".error-message");

const commentForm = document.querySelector(".comments .comment-form");
const commentInput = document.querySelector("#comment-input");

// read id from the address
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

// edit form
const editButton = document.querySelector(".edit-button");
const editForm = document.querySelector(".edit-form");
const editTitle = document.querySelector("#edit-title");
const editBody = document.querySelector("#edit-body");

let currentPost;


/////////////////////////////////////// function to get post details from the API

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

////////////////////////////////////////// function to show post details on the page

function showPostDetails(post) {
    currentPost = post;

    postDetails.innerHTML = `
        <h2>${post.title}</h2>
        <p class="info author">Written by user ${post.userId}</p> 
        <p>${post.body}</p>
        <p class="tags">Tags: ${post.tags.join(", ")}</p>
        <p class="info">👍 ${post.reactions.likes} 👎 ${post.reactions.dislikes} 👁 ${post.views}</p>
    `;
}

///////////////////////////////////////// function to get comments from the API
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

/////////////////////////////////////// function to show comments on the page//?
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
//////////////////////////////////////// function to add a comment to the page
function addCommentsToPage(comment) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <p class="info">Comment by user ${comment.user.fullName}</p>
                <p>${comment.body}</p>
            `;
            commentsList.appendChild(card);
}
// submit listener for the comment form
commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const body = commentInput.value.trim();
    if (!body) return;

    try {
        const response = await fetch(`${baseUrl}/comments/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                body: body,
                postId: Number(postId),
                userId: 1
            })
        });

        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }

        const newComment = await response.json();
        noComments.style.display = "none";//?
        addCommentsToPage({ ...newComment, userId: newComment.userId || 1 });
        commentForm.reset();
    } catch (error) {
        errorMessage.textContent = `Could not add comment: ${error.message}`;
    }
});
// click listener for the edit button
editButton.addEventListener("click", () => {
    editTitle.value = currentPost.title;
    editBody.value = currentPost.body;
    editForm.style.display = "grid";
});

// submit listener for the edit form
editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = editTitle.value.trim();
    const body = editBody.value.trim();
    if (!title || !body) return;

    try {
        const response = await fetch(`${baseUrl}/posts/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                body: body
            })
        });

        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }

        showPostDetails({ ...currentPost, title: title, body: body });
        editForm.style.display = "none";
    } catch (error) {
        errorMessage.textContent = `Could not update post: ${error.message}`;
    }  
});

getPostDetails();
getComments();
