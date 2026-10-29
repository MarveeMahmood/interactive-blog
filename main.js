let baseUrl = "https://dummyjson.com";

const errorMessage = document.querySelector(".error-message");
const postList = document.querySelector(".post-list");

// 1. Get posts from the API
async function getPosts() {
    try {
        const response = await fetch(`${baseUrl}/posts?limit=10`);
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`)
        }
        const data = await response.json();
        // console.log(data.posts);
        showPosts(data.posts);
    } catch (error) {
        errorMessage.textContent = `Could not load posts: ${error.message}`;
    }
}


// 2. Show posts on the page
function showPosts(posts) {
    postList.innerHTML = "";

    for (const post of posts) {
        const card = document.createElement("div");
        card.classList.add("card");
        
        card.innerHTML = `
            <h2>${post.title}</h2>
            <p class="info">Written by user ${post.userId}</p> 
            <p>${post.body}</p>
            <p class="tags">Tags: ${post.tags.join(", ")}</p>
            <p class="info">👍 ${post.reactions.likes} 👎 ${post.reactions.dislikes} 👁 ${post.views}</p>
            <a href="post.html?id=${post.id}">Read more</a>
        `;
        postList.appendChild(card);
    }
}
getPosts();