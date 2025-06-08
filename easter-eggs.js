document.addEventListener("DOMContentLoaded", () => {
  // --- FIX: Load themes independently from separate session storage keys ---
  const savedHouseTheme = sessionStorage.getItem("houseTheme");
  if (savedHouseTheme) {
    document.body.classList.add(savedHouseTheme);
  }
  const savedPolyjuiceTheme = sessionStorage.getItem("polyjuiceTheme");
  if (savedPolyjuiceTheme) {
    document.body.classList.add(savedPolyjuiceTheme);
  }
  const lumosState = sessionStorage.getItem("lumosState");
  if (lumosState === "active") {
    document.body.classList.add("lumos-active");
  }

  let keySequence = "";
  const lumosSpell = "lumos";
  const noxSpell = "nox";
  const sortSpell = "sortme";

  document.addEventListener("keyup", (e) => {
    if (document.body.classList.contains("quiz-active")) return;
    keySequence += e.key.toLowerCase();

    if (keySequence.endsWith(lumosSpell)) {
      document.body.classList.add("lumos-active");
      sessionStorage.setItem("lumosState", "active");
      keySequence = "";
    } else if (keySequence.endsWith(noxSpell)) {
      document.body.classList.remove("lumos-active");
      sessionStorage.removeItem("lumosState");
      keySequence = "";
    } else if (keySequence.endsWith(sortSpell)) {
      if (window.innerWidth > 600) {
        startSortingQuiz();
      }
      keySequence = "";
    }

    if (keySequence.length > 20) {
      keySequence = keySequence.slice(-20);
    }
  });

  function createGoldenSnitch() {
    if (document.querySelector(".golden-snitch")) return;
    const snitch = document.createElement("div");
    snitch.className = "golden-snitch";
    snitch.style.top = `${Math.random() * 80 + 10}vh`;
    snitch.style.left = `${Math.random() * 80 + 10}vw`;
    document.body.appendChild(snitch);
    snitch.addEventListener(
      "click",
      () => {
        alert("Congratulations! You caught the Golden Snitch!");
        snitch.remove();
        clearTimeout(disappearTimeout);
        setTimeout(createGoldenSnitch, 15000);
      },
      { once: true }
    );
    const disappearTimeout = setTimeout(() => {
      snitch.remove();
      setTimeout(createGoldenSnitch, Math.random() * 20000 + 10000);
    }, 4000);
  }
  setTimeout(createGoldenSnitch, 10000);

  const potionBottle = document.createElement("div");
  potionBottle.className = "polyjuice-potion-bottle";
  // --- FIX: Check for the correct theme state ---
  if (sessionStorage.getItem("polyjuiceTheme")) {
    potionBottle.textContent = "✨";
  } else {
    potionBottle.textContent = "🧪";
  }
  potionBottle.title = "What might this be?";
  document.body.appendChild(potionBottle);
  let clickCount = 0;
  const polyjuiceThemes = ["theme-draco", "theme-luna"];
  let currentThemeIndex = -1;

  potionBottle.addEventListener("click", () => {
    clickCount++;
    if (clickCount >= 3) {
      clickCount = 0;
      currentThemeIndex =
        (currentThemeIndex + 1) % (polyjuiceThemes.length + 1);
      const nextTheme = polyjuiceThemes[currentThemeIndex];

      // --- FIX: Only remove polyjuice themes, not house themes ---
      polyjuiceThemes.forEach((theme) => {
        document.body.classList.remove(theme);
      });

      if (nextTheme) {
        document.body.classList.add(nextTheme);
        potionBottle.textContent = "✨";
        // --- FIX: Use separate session storage key ---
        sessionStorage.setItem("polyjuiceTheme", nextTheme);
      } else {
        potionBottle.textContent = "🧪";
        // --- FIX: Use separate session storage key ---
        sessionStorage.removeItem("polyjuiceTheme");
      }
    }
  });

  const sortingHatIcon = document.createElement("img");
  sortingHatIcon.src = "hat.png";
  sortingHatIcon.alt = "Start Sorting Hat Quiz";
  sortingHatIcon.title = "Let the Sorting Hat decide!";
  sortingHatIcon.className = "sorting-hat-trigger-icon";
  document.body.appendChild(sortingHatIcon);
  sortingHatIcon.addEventListener("click", startSortingQuiz);

  const quizQuestions = [
    {
      question: "Dawn or Dusk?",
      answers: [
        { text: "Dawn", house: "Gryffindor" },
        { text: "Dusk", house: "Slytherin" },
      ],
    },
    {
      question: "Which path tempts you most?",
      answers: [
        { text: "The winding path to the sea", house: "Slytherin" },
        { text: "The sunlit path through the forest", house: "Hufflepuff" },
        {
          text: "The cobbled street lined with ancient buildings",
          house: "Ravenclaw",
        },
        { text: "The narrow, twisting alleyway", house: "Gryffindor" },
      ],
    },
    {
      question: "What do you value most?",
      answers: [
        { text: "Courage", house: "Gryffindor" },
        { text: "Loyalty", house: "Hufflepuff" },
        { text: "Wisdom", house: "Ravenclaw" },
        { text: "Ambition", house: "Slytherin" },
      ],
    },
  ];
  let houseScores = {};
  let currentQuestionIndex = 0;
  const quizModal = document.createElement("div");
  quizModal.className = "sorting-hat-modal";
  quizModal.innerHTML = ` <div class="modal-content"> <div id="quiz-header"> <h2>The Sorting Hat</h2> <img src="hat.png" alt="Sorting Hat" width="100"/> </div> <div id="quiz-body"> <p id="quiz-question"></p> <div id="quiz-answers"></div> </div> <div id="quiz-result" style="display: none;"> <h2>You belong in...</h2> <h1 id="house-result"></h1> <button id="close-quiz">Awesome!</button> </div> </div> `;
  document.body.appendChild(quizModal);

  function startSortingQuiz() {
    if (
      document.body.classList.contains("theme-draco") ||
      document.body.classList.contains("theme-luna")
    ) {
      alert("The magic is too strong! Reset the Polyjuice Potion first (🧪).");
      return;
    }
    document.body.classList.add("quiz-active");
    houseScores = { Gryffindor: 0, Hufflepuff: 0, Ravenclaw: 0, Slytherin: 0 };
    currentQuestionIndex = 0;
    quizModal.querySelector("#quiz-body").style.display = "block";
    quizModal.querySelector("#quiz-result").style.display = "none";
    displayQuestion();
    quizModal.style.display = "flex";
  }
  function displayQuestion() {
    const questionData = quizQuestions[currentQuestionIndex];
    const questionEl = quizModal.querySelector("#quiz-question");
    const answersEl = quizModal.querySelector("#quiz-answers");
    questionEl.textContent = questionData.question;
    answersEl.innerHTML = "";
    questionData.answers.forEach((answer) => {
      const button = document.createElement("button");
      button.className = "quiz-answer";
      button.textContent = answer.text;
      button.onclick = () => selectAnswer(answer.house);
      answersEl.appendChild(button);
    });
  }
  function selectAnswer(house) {
    houseScores[house]++;
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      displayQuestion();
    } else {
      endQuiz();
    }
  }
  function endQuiz() {
    let sortedHouse = "";
    let maxScore = -1;
    for (const house in houseScores) {
      if (houseScores[house] > maxScore) {
        maxScore = houseScores[house];
        sortedHouse = house;
      }
    }
    const tiedHouses = Object.keys(houseScores).filter(
      (h) => houseScores[h] === maxScore
    );
    if (tiedHouses.length > 1) {
      sortedHouse = tiedHouses[Math.floor(Math.random() * tiedHouses.length)];
    }
    quizModal.querySelector("#quiz-body").style.display = "none";
    quizModal.querySelector("#quiz-result").style.display = "block";
    const resultEl = quizModal.querySelector("#house-result");
    resultEl.textContent = sortedHouse.toUpperCase() + "!";
    resultEl.className = `house-text-${sortedHouse.toLowerCase()}`;
    applyHouseTheme(sortedHouse.toLowerCase());
  }
  function applyHouseTheme(house) {
    const themeClass = `theme-${house}`;
    // --- FIX: Only remove other house themes, not polyjuice themes ---
    const houseThemes = [
      "theme-gryffindor",
      "theme-hufflepuff",
      "theme-ravenclaw",
      "theme-slytherin",
    ];
    houseThemes.forEach((theme) => {
      document.body.classList.remove(theme);
    });

    document.body.classList.add(themeClass);
    // --- FIX: Use separate session storage key ---
    sessionStorage.setItem("houseTheme", themeClass);
  }
  quizModal.querySelector("#close-quiz").addEventListener("click", () => {
    quizModal.style.display = "none";
    document.body.classList.remove("quiz-active");
  });
});
