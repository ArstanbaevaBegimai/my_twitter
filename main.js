const API = "http://localhost:8000/posts";
let searchValue = "";

const form = $(".tweet-form");
const inpPost = $(".tweet-text");
const inpImage = $(".tweet-image");
const btn = $(".tweet-button");
const tweetPosts = $(".posts");

// ! CREATE
form.on("submit", async (e) => {
  e.preventDefault();
  let post = inpPost.val().trim();
  let image = inpImage.val().trim();
  let newPost = {
    post: post,
    image: image,
  };

  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });

  inpPost.val("");
  inpImage.val("");
  getPosts();
});

// ! READ
async function getPosts() {
  const response = await fetch(`${API}?q=${searchValue}`);
  const data = await response.json();

  // ! pagination start
  let first = currentPage * postsPerPage - postsPerPage;
  let last = currentPage * postsPerPage;
  const currentPosts = data.slice(first, last);
  lastPage = Math.ceil(data.length / postsPerPage) || 1;

  if (currentPage === 1) {
    prevBtn.addClass("disabled");
  } else {
    prevBtn.removeClass("disabled");
  }
  if (currentPage === lastPage) {
    nextBtn.addClass("disabled");
  } else {
    nextBtn.removeClass("disabled");
  }

  tweetPosts.html("");
  currentPosts.forEach((item) => {
    tweetPosts.prepend(`<div class="tweet-posts">
    <img
    src="./images/aiony-haust-3TLl_97HNJo-unsplash.jpg"
    alt=""
    class="post-avatar"
  /> <span><i>shared a tweet</i></span>

    <img
      src="${item.image}"
      alt=""
      class="post-img"
    />
    <p class="post-description">
      ${item.post}
    </p>
    <div class="post-icons">
      <button id='${item.id}'
      class="btn-like">
        <img src="./icons/heart.png" alt="" />
      </button>
      <button id="${item.id}" class="btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <img src="./icons/pen.png" alt="" />
      </button>
      <button id="${item.id}" class="btn-delete ">
        <img src="./icons/delete.png" alt="" />
      </button>
    </div>
  </div>`);
  });
}
getPosts();

// ! DELETE

tweetPosts.on("click", ".btn-delete", async (e) => {
  let id = e.currentTarget.id;
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  getPosts();
});

// ! UPDATE

const editForm = $(".edit-form");
const editInpPost = $(".edit-text");
const editInpImage = $(".edit-image");
const editModal = $(".modal");

$(document).on("click", ".btn-edit", async (e) => {
  let id = e.currentTarget.id;
  editForm.attr("id", id);
  const response = await fetch(`${API}/${id}`);
  const data = await response.json();
  editInpPost.val(data.post);
  editInpImage.val(data.image);
  editForm.on("submit", async (e) => {
    e.preventDefault();
    let editPost = editInpPost.val().trim();
    let editImage = editInpImage.val().trim();
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: editPost, image: editImage }),
    });
    getPosts();
    editModal.modal("hide");
  });
});

// ! Pagination
let prevBtn = $(".prev-btn");
let nextBtn = $(".next-btn");

let postsPerPage = 3;
let currentPage = 1;
let lastPage = 1;

nextBtn.on("click", () => {
  if (currentPage === lastPage) {
    return;
  }
  currentPage++;
  getPosts();
  window.scrollTo(0, 0);
});

prevBtn.on("click", () => {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  getPosts();
  window.scrollTo(0, 0);
});

// ! Live search
let inpSearch = $(".inp-search");

inpSearch.on("input", (e) => {
  searchValue = e.target.value;
  currentPage = 1;
  getPosts();
});
