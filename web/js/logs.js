// ==========================
// Pip-Boy Dev Logs Loader
// ==========================

// Select the logs container in the DOM
const logsContainer = document.getElementById("logs-container");

// Path to JSON file with all logs
const logFilePath = "../data/logs/dev_log_001.json";

// Load all logs from the JSON file
async function loadDevLogs() {
  try {
    const response = await fetch(logFilePath);
    const data = await response.json();
    const allLogs = data.logs;  // Array of log objects

    logsContainer.innerHTML = ""; // Clear previous logs

    // Loop through each log file
    for (const log of allLogs) {
      // Display log title
      const titleDiv = document.createElement("div");
      titleDiv.classList.add("log-entry");
      titleDiv.textContent = `[${log.date}] ${log.title}`;
      logsContainer.appendChild(titleDiv);

      // Animate each log entry line
      for (const entry of log.entries) {
        await animateLogEntry(entry);
      }
    }
  } catch (err) {
    console.error("Failed to load dev logs:", err);
    logsContainer.textContent = "Error loading dev logs.";
  }
}

// Animate a single log line like a terminal
function animateLogEntry(text) {
  return new Promise(res => {
    const maxChars = 60; // Wrap lines at 60 characters
    let start = 0;

    function appendLine() {
      if (start < text.length) {
        const line = text.slice(start, start + maxChars);
        const div = document.createElement("div");
        div.classList.add("log-entry");
        div.textContent = line;
        logsContainer.appendChild(div);

        // Auto-scroll to newest line
        logsContainer.scrollTop = logsContainer.scrollHeight;

        start += maxChars;
        setTimeout(appendLine, 50); // Delay for “typing” effect
      } else {
        res(); // Resolve promise after full line added
      }
    }

    appendLine();
  });
}

// Start loading logs when page loads
loadDevLogs();
