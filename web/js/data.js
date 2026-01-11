// ======================================================
// DATA TAB: LOGS & QUESTS LOGIC
// ======================================================

// Wait for the DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
  
  // FIXED: Elements are only accessible after DOM is loaded
  const logList = document.getElementById("log-list");
  const logContent = document.getElementById("log-content");
  const questList = document.getElementById("quest-list");
  
  // Clear DATA view with null checks
  function clearData() {
    // FIXED: Check if elements exist before trying to modify them
    if (logList) logList.innerHTML = "";
    if (logContent) logContent.textContent = "";
    if (questList) questList.innerHTML = "";
  }
  
  // Load logs list
  async function loadLogs() {
    // FIXED: clearData now has null checks, won't crash if elements don't exist
    clearData();
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/data/logs");
      const logs = await res.json();
      
      // Only proceed if logList exists
      if (logList) {
        logs.forEach(name => {
          const li = document.createElement("li");
          li.textContent = name;
          
          li.onclick = async () => {
            const r = await fetch(
              `http://127.0.0.1:8000/api/data/log?name=${encodeURIComponent(name)}`
            );
            const data = await r.json();
            
            // Only update if logContent exists
            if (logContent) {
              logContent.textContent = data.content;
            }
          };
          
          logList.appendChild(li);
        });
      }
    } catch (error) {
      console.error("Error loading logs:", error);
    }
  }
  
  // Load quests
  async function loadQuests() {
    clearData();
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/data/quests");
      const quests = await res.json();
      
      // Only proceed if questList exists
      if (questList) {
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
    } catch (error) {
      console.error("Error loading quests:", error);
    }
  }
  
  // DATA tab buttons - add null check for the container
  const dataTabsContainer = document.querySelectorAll("#data-tabs button");
  
  if (dataTabsContainer.length > 0) {
    dataTabsContainer.forEach(btn => {
      btn.onclick = () => {
        if (btn.dataset.data === "logs") loadLogs();
        if (btn.dataset.data === "quests") loadQuests();
      };
    });
  }
  
  // Load logs by default when DATA is opened - add null check
  const dataTab = document.querySelector('[data-tab="data"]');
  
  if (dataTab) {
    dataTab.addEventListener("click", loadLogs);
  }
  
});