const spellsApiUrl = "https://potterapi-fedeperin.vercel.app/en/spells";

async function fetchSpells() {
  const container = document.getElementById("spells-list");
  const loader = document.querySelector(".loader");

  try {
    const res = await fetch(spellsApiUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const spells = await res.json();

    loader.style.display = "none";

    spells.forEach((spell) => {
      const card = document.createElement("div");
      card.className = "card";

      const details = document.createElement("div");
      details.className = "card-details";
      details.innerHTML = `
        <h2>${spell.spell}</h2>
        <p><strong>Use:</strong> ${spell.use || "N/A"}</p>
      `;

      card.appendChild(details);
      container.appendChild(card);
    });

    // Animate cards after they are added to the DOM
    document.dispatchEvent(new CustomEvent("cardsLoaded"));
  } catch (error) {
    loader.textContent =
      "The Ministry of Magic has restricted access to this spell information.";
    console.error("Failed to fetch spells:", error);
  }
}

fetchSpells();

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
