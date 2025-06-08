const housesApiUrl = "https://potterapi-fedeperin.vercel.app/en/houses";

async function fetchHouses() {
  const container = document.getElementById("houses-list");
  const loader = document.querySelector(".loader");

  try {
    const res = await fetch(housesApiUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const houses = await res.json();

    loader.style.display = "none";

    houses.forEach((house) => {
      const card = document.createElement("div");
      card.className = "card";

      const details = document.createElement("div");
      details.className = "card-details";
      details.innerHTML = `
        <h2>${house.house}</h2>
        <p><strong>Founder:</strong> ${house.founder}</p>
        <p><strong>Animal:</strong> ${house.emoji}</p>
        <p><strong>Founder:</strong> ${house.founder || "N/A"}</p>
        <p><strong>Colors:</strong> ${house.colors?.join(", ") || "N/A"}</p>
      `;

      card.appendChild(details);
      container.appendChild(card);
    });

    // Animate cards after they are added to the DOM
    document.dispatchEvent(new CustomEvent("cardsLoaded"));
  } catch (error) {
    loader.textContent =
      "Could not retrieve house information. The common rooms are sealed.";
    console.error("Failed to fetch houses:", error);
  }
}

fetchHouses();

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
