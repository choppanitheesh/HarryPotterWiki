const booksApiUrl = "https://potterapi-fedeperin.vercel.app/en/books";

async function fetchBooks() {
  const container = document.getElementById("books-list");
  const loader = document.querySelector(".loader");

  try {
    const res = await fetch(booksApiUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const books = await res.json();

    loader.style.display = "none";

    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src =
        book.cover || "https://via.placeholder.com/150x200?text=No+Cover";
      img.alt = `Cover of ${book.title}`;
      img.loading = "lazy";

      const details = document.createElement("div");
      details.className = "card-details";
      details.innerHTML = `
        <h2>${book.title}</h2>
        <p class="description"><strong>Description:</strong> ${
          book.description || "No description available."
        }</p>
        <p><strong>Release Date:</strong> ${book.releaseDate || "Unknown"}</p>
        <p><strong>Pages:</strong> ${book.pages || "N/A"}</p>
      `;

      card.appendChild(img);
      card.appendChild(details);
      container.appendChild(card);
    });

    // Animate cards after they are added to the DOM
    document.dispatchEvent(new CustomEvent("cardsLoaded"));
  } catch (error) {
    loader.textContent =
      "Could not summon the book records. The library may be closed.";
    console.error("Failed to fetch books:", error);
  }
}

fetchBooks();

// Listen for the custom event to animate cards
document.addEventListener("cardsLoaded", () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }, i * 100);
  });
});
