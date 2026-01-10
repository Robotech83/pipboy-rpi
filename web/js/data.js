// ======================================================
// DATA TAB: LOGS & QUESTS LOGIC
// ======================================================

const logList = document.getElementById("log-list");
const logContent = document.getElementById("log-content");
const questList = document.getElementById("quest-list");

// Clear DATA view
function clearData() {
  logList.innerHTML = "";
  logContent.textContent = "";
  questList.innerHTML = "";
}

// Load logs list
async function loadLogs() {
  clearData();

  const res = await fetch("http://127.0.0.1:8000/api/data/logs");
  const logs = await res.json();

  logs.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;

    li.onclick = async () => {
      const r = await fetch(
        `http://127.0.0.1:8000/api/data/log?name=${encodeURIComponent(name)}`
      );
      const data = await r.json();
      logContent.textContent = data.content;
    };

    logList.appendChild(li);
  });
}

// Load quests
async function loadQuests() {
  clearData();

  const res = await fetch("http://127.0.0.1:8000/api/data/quests");
  const quests = await res.json();

  quests.forEach(q => {
    const div = document.createElement("div");
    div.className = "quest";

    div.innerHTML = `
      <strong>${q.title}</strong><br>
      Status: ${q.status}<br>
      ${q.description}<br>
      <ul>${q.objectives.map(o => `<li>${o}</li>`).join("")}</ul>
    `;

    questList.appendChild(div);
  });
}

// DATA tab buttons
document.querySelectorAll("#data-tabs button").forEach(btn => {
  btn.onclick = () => {
    if (btn.dataset.data === "logs") loadLogs();
    if (btn.dataset.data === "quests") loadQuests();
  };
});

// Load logs by default when DATA is opened
document.querySelector('[data-tab="data"]').addEventListener("click", loadLogs);
