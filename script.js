const lessonList = document.getElementById("lesson-list");

function renderStars(mastery) {
  const count = Math.max(0, Math.min(5, mastery));
  return "⭐️".repeat(count);
}

lessons.forEach((lesson) => {
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
    <div class="english">${lesson.english}</div>
    <button class="play-button">▶ Play</button>
    <audio src="${lesson.audio}" preload="none"></audio>
  `;

  const button = card.querySelector(".play-button");
  const audio = card.querySelector("audio");

  button.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play();
  });

  lessonList.appendChild(card);
});
