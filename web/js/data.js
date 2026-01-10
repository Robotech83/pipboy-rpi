/* =========================
   QUEST DATA HANDLING
   ========================= */

/*
  In v1 we load quests statically.
  Later this can come from backend or filesystem.
*/

const quests = [
  {
    id: 1,
    title: "System Broadcast Online",
    objectives: [
      "Design RADIO user interface",
      "Implement audio playback logic",
      "Support local audio files",
      "Add internet radio stream support"
    ],
    completed: false
  },
  {
    id: 2,
    title: "Backend Services Initialization",
    objectives: [
      "Choose backend language",
      "Create local API service",
      "Connect frontend to backend"
    ],
    completed: false
  }
];

/* =========================
   RENDER QUESTS
   ========================= */

function renderQuests() {
  const questList = document.getElementById("quest-list");
  questList.innerHTML = ""; // clear previous render

  quests.forEach((quest) => {
    // Create quest container
    const questDiv = document.createElement("div");
    questDiv.classList.add("quest");

    if (quest.completed) {
      questDiv.classList.add("completed");
    }

    // Quest title + checkbox
    const title = document.createElement("h3");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = quest.completed;

    // Toggle completion
    checkbox.addEventListener("change", () => {
      quest.completed = checkbox.checked;
      renderQuests(); // re-render UI
    });

    title.appendChild(checkbox);
    title.appendChild(document.createTextNode(quest.title));

    // Objective list
    const ul = document.createElement("ul");
    quest.objectives.forEach((obj) => {
      const li = document.createElement("li");
      li.textContent = obj;
      ul.appendChild(li);
    });

    // Assemble quest
    questDiv.appendChild(title);
    questDiv.appendChild(ul);
    questList.appendChild(questDiv);
  });
}

// Initial render on page load
renderQuests();
