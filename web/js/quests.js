// ===============================
// QUEST CHECK STATE (localStorage)
// ===============================

function storageKey(questId) {
  return `pipboy.quest.${questId}.objectives`;
}

// Returns an array of objective indexes that are completed
function loadObjectiveState(questId) {
  try {
    const raw = localStorage.getItem(storageKey(questId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to read objective state:", questId, error);
    return [];
  }
}

// Saves an array of objective indexes that are completed
function saveObjectiveState(questId, completedIndexesArray) {
  try {
    localStorage.setItem(storageKey(questId), JSON.stringify(completedIndexesArray));
  } catch (error) {
    console.warn("Failed to save objective state:", questId, error);
  }
}


// ================================
// QUEST SYSTEM LOADER
// ================================

// Path to quest index file
const QUEST_INDEX_PATH = "../data/quests/quest_index.json";

// Container in HTML
const questsContainer = document.getElementById("quests-container");

// Archived quests container
const archivedContainer = document.getElementById("quests-archived");


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
  // Defensive defaults
  const questId = quest.id ?? quest.title ?? "unknown";
  const titleText = quest.title ?? "Untitled Quest";
  const descText = quest.description ?? "";
  const objectives = Array.isArray(quest.objectives) ? quest.objectives : [];

  // Load saved completion state for this quest
  const completedIndexes = new Set(loadObjectiveState(questId));

  // Card wrapper
  const card = document.createElement("div");
  card.className = "quest-card";

  // Title
  const title = document.createElement("div");
  title.className = "quest-title";
  title.textContent = titleText;

  // Status row
  const statusRow = document.createElement("div");
  statusRow.className = "quest-status";

  const statusLabel = document.createElement("span");
  statusLabel.className = "label";
  statusLabel.textContent = "Status: ";

  const statusValue = document.createElement("span");
  statusValue.className = "value";
  statusRow.appendChild(statusLabel);
  statusRow.appendChild(statusValue);

  // Description
  const desc = document.createElement("div");
  desc.className = "quest-desc";
  desc.textContent = descText;

  // Objectives list
  const ul = document.createElement("ul");
  ul.className = "quest-objectives";

  // --- helper: set status based on completion ---
  function updateQuestCompletionUI() {
    const allDone = objectives.length > 0 && completedIndexes.size === objectives.length;

    if (allDone) {
      statusValue.textContent = "COMPLETED";
      statusValue.className = "value completed";
      card.classList.add("quest-completed");
    } else {
      statusValue.textContent = "ACTIVE";
      statusValue.className = "value active";
      card.classList.remove("quest-completed");
    }
    // Move card to appropriate container
    placeCard();
  }

  // Render objectives
  objectives.forEach((objText, idx) => {
    const li = document.createElement("li");
    li.className = "quest-objective";
    li.tabIndex = 0;

    const mark = document.createElement("span");
    mark.className = "obj-mark";

    const text = document.createElement("span");
    text.className = "obj-text";
    text.textContent = objText;

    // Apply saved state
    if (completedIndexes.has(idx)) {
      li.classList.add("completed");
    }

    const toggle = () => {
      li.classList.toggle("completed");

      if (li.classList.contains("completed")) completedIndexes.add(idx);
      else completedIndexes.delete(idx);

      // Save
      saveObjectiveState(questId, Array.from(completedIndexes).sort((a, b) => a - b));

      // Update status
      updateQuestCompletionUI();
    };

    li.addEventListener("click", toggle);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });

    li.appendChild(mark);
    li.appendChild(text);
    ul.appendChild(li);
  });

  // Assemble card
  card.appendChild(title);
  card.appendChild(statusRow);
  card.appendChild(desc);
  card.appendChild(ul);

  // Place card in appropriate container
function placeCard() {
  if (!archivedContainer || !questsContainer) {
    questsContainer.appendChild(card);
    return;
  }

  // Move card based on completion status
  if (card.classList.contains("quest-completed")) {
    archivedContainer.appendChild(card);
  } else {
    questsContainer.appendChild(card);
  }
}

  placeCard();

  // Set initial status correctly on load
  updateQuestCompletionUI();
}
