let baseUrl = "https://dummyjson.com";

const errorMessage = document.querySelector(".error-message");
const postList = document.querySelector(".post-list");

////////////////////////////////////// function to get posts from the API

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


///////////////////////////////////// function to show posts on the page

function showPosts(posts) {
    postList.innerHTML = "";

    for (const post of posts) {
        const card = document.createElement("div");
        card.classList.add("card");
        
        card.innerHTML = `
            <h2>${post.title}</h2>
            <p class="info author">Written by user ${post.userId}</p> 
            <p>${post.body}</p>
            <p class="tags">Tags: ${post.tags.join(", ")}</p>
            <p class="info">👍 ${post.reactions.likes} 👎 ${post.reactions.dislikes} 👁 ${post.views}</p>
            <a href="post.html?id=${post.id}">Read more</a>
        `;

        // delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");


        card.appendChild(deleteButton);
        //click listener
        deleteButton.addEventListener("click", () => {
            //console.log(`Delete post with ID: ${post.id}`);

        deletePost(post.id, card);
        });

        postList.appendChild(card);
    }
}
getPosts();

/////////////////////////////////////// function to delete a post

async function deletePost(id, card) {
    try {
        const response = await fetch(`${baseUrl}/posts/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }  
        card.remove();
    } catch (error) {
        errorMessage.textContent = `Could not delete post: ${error.message}`;
    }
}


