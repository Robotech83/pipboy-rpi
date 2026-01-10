// ================================
// QUEST SYSTEM LOADER
// ================================

// Path to quest index file
const QUEST_INDEX_PATH = "../data/quests/quests_index.json";

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
      // indexData.quests is an array of filenames
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

// Render quest to Pip-Boy UI
function renderQuest(quest) {
  // Check if container still exists
  if (!questsContainer) {
    console.warn("Quest container not found. Cannot render quest.");
    return;
  }
  
  const questDiv = document.createElement("div");
  questDiv.className = "quest";

  questDiv.innerHTML = `
    <div class="quest-title">${quest.title}</div>
    <div class="quest-desc">${quest.description}</div>
    <ul class="quest-objectives">
      ${quest.objectives.map(obj => `<li>[ ] ${obj}</li>`).join("")}
    </ul>
  `;

  questsContainer.appendChild(questDiv);
}