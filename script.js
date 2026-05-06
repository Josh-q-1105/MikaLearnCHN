const lessonList = document.getElementById("lesson-list");
const masteryFilters = document.querySelectorAll(".mastery-filter");
const filterCount = document.getElementById("filter-count");

let activeAudio = null;
let activeCard = null;
let activePlayButton = null;

function renderStars(mastery) {
  const count = Math.max(0, Math.min(5, mastery));
  return "⭐️".repeat(count);
}

function getSelectedMasteries() {
  return Array.from(masteryFilters)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => Number(checkbox.value));
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

function resetPlayButton(button) {
  if (!button) return;
  button.classList.remove("playing");
  button.innerHTML = "▶ Play";
}

function setPlayButtonPlaying(button) {
  if (!button) return;
  button.classList.add("playing");
  button.innerHTML = "🔊 Playing";
}

function updateFilterCount(selectedMasteries, visibleCount) {
  if (selectedMasteries.length === 0) {
    filterCount.textContent = `Showing all ${visibleCount} cards`;
  } else {
    filterCount.textContent = `Selected ${selectedMasteries.length} / 5 · Showing ${visibleCount} cards`;
  }
}

function renderLessons() {
  lessonList.innerHTML = "";

  const selectedMasteries = getSelectedMasteries();
  let visibleCount = 0;

  lessons.forEach((lesson) => {
    if (!shouldShowLesson(lesson, selectedMasteries)) {
      return;
    }

    visibleCount += 1;

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
        <button class="translation-toggle" type="button">Show Translation</button>
        <div class="translation-panel">
          <div class="english-content">${lesson.english}</div>
          <button class="translation-hide" type="button">Hide Translation</button>
        </div>
      </div>

      <button class="play-button" type="button">▶ Play</button>
      <audio src="${lesson.audio}" preload="none"></audio>
    `;

    const button = card.querySelector(".play-button");
    const audio = card.querySelector("audio");
    const translationToggle = card.querySelector(".translation-toggle");
    const translationPanel = card.querySelector(".translation-panel");
    const translationHide = card.querySelector(".translation-hide");

    translationToggle.addEventListener("click", () => {
      translationToggle.classList.add("hidden");
      translationPanel.classList.add("open");
    });

    translationHide.addEventListener("click", () => {
      translationPanel.classList.remove("open");
      translationToggle.classList.remove("hidden");
    });

    button.addEventListener("click", () => {
      if (activeAudio && activeAudio !== audio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }

      if (activePlayButton && activePlayButton !== button) {
        resetPlayButton(activePlayButton);
      }

      clearActiveCard();
      card.classList.add("playing");
      activeCard = card;

      setPlayButtonPlaying(button);
      activePlayButton = button;

      audio.currentTime = 0;
      audio.play();
      activeAudio = audio;
    });

    audio.addEventListener("ended", () => {
      if (activeAudio === audio) {
        activeAudio = null;
      }

      card.classList.remove("playing");

      if (activePlayButton === button) {
        resetPlayButton(button);
        activePlayButton = null;
      }
    });

    lessonList.appendChild(card);
  });

  updateFilterCount(selectedMasteries, visibleCount);
}

masteryFilters.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    renderLessons();
  });
});

renderLessons();
