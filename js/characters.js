const charactersApiUrl = "https://potterapi-fedeperin.vercel.app/en/characters";

async function fetchCharacters() {
  const container = document.getElementById("characters-list");
  const loader = document.querySelector(".loader");

  try {
    const res = await fetch(charactersApiUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const characters = await res.json();

    loader.style.display = "none";

    characters.slice(0, 50).forEach((char) => {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src =
        char.image || "https://via.placeholder.com/150x225?text=No+Image";
      img.alt = char.fullName;
      img.loading = "lazy";

      const details = document.createElement("div");
      details.className = "card-details";
      details.innerHTML = `
        <h2>${char.fullName}</h2>
        <p><strong>House:</strong> ${char.hogwartsHouse || "Unknown"}</p>
        <p><strong>Nickname:</strong> ${char.nickname || "N/A"}</p>
        <p><strong>Born:</strong> ${char.birthdate || "Unknown"}</p>
        <p><strong>Interpreted By:</strong> ${
          char.interpretedBy || "Unknown"
        }</p>
      `;

      card.appendChild(img);
      card.appendChild(details);
      container.appendChild(card);
    });

    // Animate cards after they are added to the DOM
    document.dispatchEvent(new CustomEvent("cardsLoaded"));
  } catch (error) {
    loader.textContent =
      "Could not find the characters. Perhaps they are using the Disillusionment Charm.";
    console.error("Failed to fetch characters:", error);
  }
}

fetchCharacters();

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
