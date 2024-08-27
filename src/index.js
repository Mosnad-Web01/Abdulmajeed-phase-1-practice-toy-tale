let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // Toggle the display of the toy form
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  fetchToys();
    const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    addNewToy(event);
  });
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    });
}

function renderToy(toy) {
  const toyDiv = document.createElement("div");
  toyDiv.classList.add("card");
  toyDiv.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" alt="${toy.name}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn">Like </button>
  `;
  const toyCollection = document.getElementById("toy-collection");
  toyCollection.appendChild(toyDiv);
  const likeBtn = toyDiv.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    likeToy(toy, toyDiv);
  });
}

function addNewToy(event) {
  const toyName = event.target.name.value;
  const toyImage = event.target.image.value;

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: toyName,
      image: toyImage,
      likes: 0
    })
  })
  .then(response => response.json())
  .then(newToy => {
    renderToy(newToy);
    event.target.reset(); 
  })
  .catch(error => console.error("Error:", error));
}

function likeToy(toy, toyDiv) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
  .then(response => response.json())
  .then(updatedToy => {
    toy.likes = updatedToy.likes; // Update the local toy object
    toyDiv.querySelector("p").innerText = `${toy.likes} Likes`;
  })
  .catch(error => console.error("Error:", error));
}
