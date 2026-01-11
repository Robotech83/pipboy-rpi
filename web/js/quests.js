// ================================
// QUEST SYSTEM LOADER
// ================================

// Path to quest index file
const QUEST_INDEX_PATH = "../data/quests/quest_index.json";

// Container in HTML
const questsContainer = document.getElementById("quests-container");

// Only run if container exists
if (questsContainer) {
  // Load quest index first
  fetch(QUEST_INDEX_PATH)
    .then(response => {
      if (!response.ok) throw new Error("Quest index not found");
      return response.json();
    })
    .then(indexData => {
      console.log("QUEST INDEX LOADED:", indexData);

      if (!Array.isArray(indexData.quests)) {
        throw new Error("Quest index format invalid");
      }

      indexData.quests.forEach(loadQuestFile);
    })
    .catch(error => {
      questsContainer.textContent = "ERROR LOADING QUEST INDEX";
      console.error(error);
    });
} else {
  console.warn("Quest container not found. Element with id 'quests-container' is missing.");
}

// Load individual quest file
function loadQuestFile(filename) {
  fetch(`../data/quests/${filename}`)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load ${filename}`);
      return response.json();
    })
    .then(quest => renderQuest(quest))
    .catch(error => {  // <--- LINE 29: MUST BE "error" NOT "err"
      console.error("Failed to load quest file:", filename, error);
    });  // <--- LINE 31: This is likely where the error is
}

// Render quest 
function renderQuest(quest) {
  if (!questsContainer) return;

  const questDiv = document.createElement("div");
  questDiv.className = "quest";

  // Quest title
  const title = document.createElement("div");
  title.className = "quest-title";
  title.textContent = quest.title;

  // Description
  const desc = document.createElement("div");
  desc.className = "quest-desc";
  desc.textContent = quest.description;

  // Objectives list
  const ul = document.createElement("ul");
  ul.className = "quest-objectives";

  quest.objectives.forEach(obj => {
    const li = document.createElement("li");
    li.className = "quest-objective";
    li.textContent = "[ ] " + obj;

    // Click to toggle
    li.addEventListener("click", () => {
      li.classList.toggle("completed");

      if (li.classList.contains("completed")) {
        li.textContent = "[✓] " + obj;
      } else {
        li.textContent = "[ ] " + obj;
      }
    });

    ul.appendChild(li);
  });

  questDiv.appendChild(title);
  questDiv.appendChild(desc);
  questDiv.appendChild(ul);

  questsContainer.appendChild(questDiv);
}
