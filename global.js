document.addEventListener("DOMContentLoaded", () => {
  // --- Persistent Background Music ---
  const audioPlayer = document.getElementById("bg-music");
  const soundToggle = document.getElementById("sound-toggle");

  function setupMusic() {
    if (!audioPlayer || !soundToggle) return;

    const isPlaying = sessionStorage.getItem("musicIsPlaying") === "true";
    const musicTime = parseFloat(sessionStorage.getItem("musicTime")) || 0;
    const musicVolume =
      parseFloat(sessionStorage.getItem("musicVolume")) || 0.6;

    audioPlayer.volume = musicVolume;
    audioPlayer.currentTime = musicTime;

    if (isPlaying) {
      audioPlayer
        .play()
        .catch((e) => console.error("Autoplay was prevented:", e));
      soundToggle.textContent = "🔊";
    } else {
      soundToggle.textContent = "🔇";
    }

    soundToggle.addEventListener("click", toggleMusic);
  }

  function toggleMusic() {
    if (audioPlayer.paused) {
      audioPlayer.play();
      soundToggle.textContent = "🔊";
      sessionStorage.setItem("musicIsPlaying", "true");
    } else {
      audioPlayer.pause();
      soundToggle.textContent = "🔇";
      sessionStorage.setItem("musicIsPlaying", "false");
    }
  }

  window.addEventListener("beforeunload", () => {
    if (audioPlayer) {
      sessionStorage.setItem("musicTime", audioPlayer.currentTime);
      sessionStorage.setItem("musicVolume", audioPlayer.volume);
    }
  });

  setupMusic();

  // --- Magical Runes Background ---
  const magicBg = document.createElement("div");
  magicBg.className = "magic-bg";
  const runes = ["ᛟ", "✦", "ᚠ", "◯", "ᛞ", "☽", "ᛉ"];
  runes.forEach((runeChar) => {
    const rune = document.createElement("div");
    rune.className = "rune";
    rune.textContent = runeChar;
    magicBg.appendChild(rune);
  });
  document.body.prepend(magicBg);

  // --- Custom mouse cursor, wand sparkles, and lumos effect position ---
  const customCursor = document.createElement("div");
  customCursor.className = "custom-cursor";
  document.body.appendChild(customCursor);

  document.addEventListener("mousemove", (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
    document.body.style.setProperty("--cursor-x", `${e.clientX}px`);
    document.body.style.setProperty("--cursor-y", `${e.clientY}px`);
  });

  let lastSparkleTime = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastSparkleTime < 50) return;
    lastSparkleTime = now;

    const spark = document.createElement("div");
    spark.className = "wand-spark";
    spark.style.left = `${e.pageX}px`;
    spark.style.top = `${e.pageY}px`;
    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 1000);
  });

  // --- Animate Cards on Load ---
  function animateCardsOnLoad() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.style.opacity = 1;
        card.style.transform = "translateY(0)";
      }, i * 100);
    });
  }

  // Check if we are on a page with cards to animate
  if (document.querySelector(".card")) {
    animateCardsOnLoad();
  }
});
