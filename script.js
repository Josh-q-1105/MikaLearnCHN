const lessonList = document.getElementById("lesson-list");
const masteryFilters = document.querySelectorAll(".mastery-filter");

let activeAudio = null;
let activeCard = null;

function renderStars(mastery) {
  const count = Math.max(0, Math.min(5, mastery));
  return "⭐️".repeat(count);
}

function getSelectedMasteries() {
  const selected = Array.from(masteryFilters)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => Number(checkbox.value));

  return selected;
}

function shouldShowLesson(lesson, selectedMasteries) {
  if (selectedMasteries.length === 0) {
    return true;
  }
  return selectedMasteries.includes(lesson.mastery);
}

function clearActiveCard() {
  if (activeCard) {
    activeCard.classList.remove("playing");
    activeCard = null;
  }
}

function renderLessons() {
  lessonList.innerHTML = "";

  const selectedMasteries = getSelectedMasteries();

  lessons.forEach((lesson) => {
    if (!shouldShowLesson(lesson, selectedMasteries)) {
      return;
    }

    const card = document.createElement("div");
    card.className = "lesson-card";

    card.innerHTML = `
      <div class="mastery">
        <span class="mastery-label">Mastery (${lesson.mastery}/5)</span>
        <span>${renderStars(lesson.mastery)}</span>
      </div>
      <div class="lesson-number">#${lesson.id}</div>
      <div class="chinese">${lesson.chinese}</div>
      <div class="pinyin">${lesson.pinyin}</div>
      <div class="english-wrapper">
        <div class="english-hidden">Show Translation</div>
        <div class="english-content" style="display: none;">${lesson.english}</div>
        <div class="english-toggle" style="display: none;">Hide Translation</div>
      </div>
      <button class="play-button">▶ Play</button>
      <audio src="${lesson.audio}" preload="none"></audio>
    `;

    const button = card.querySelector(".play-button");
    const audio = card.querySelector("audio");
    const englishHidden = card.querySelector(".english-hidden");
    const englishContent = card.querySelector(".english-content");
    const englishToggle = card.querySelector(".english-toggle");

    englishHidden.addEventListener("click", () => {
      englishHidden.style.display = "none";
      englishContent.style.display = "block";
      englishToggle.style.display = "block";
    });

    englishToggle.addEventListener("click", () => {
      englishContent.style.display = "none";
      englishToggle.style.display = "none";
      englishHidden.style.display = "block";
    });

    button.addEventListener("click", () => {
      if (activeAudio && activeAudio !== audio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }

      clearActiveCard();
      card.classList.add("playing");
      activeCard = card;

      audio.currentTime = 0;
      audio.play();
      activeAudio = audio;
    });

    audio.addEventListener("ended", () => {
      if (activeAudio === audio) {
        activeAudio = null;
      }
    });

    lessonList.appendChild(card);
  });
}

masteryFilters.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    renderLessons();
  });
});

renderLessons();
