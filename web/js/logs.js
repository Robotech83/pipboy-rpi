const logsContainer = document.getElementById("logs-container");
const logFilePath = "../data/logs/dev_log_001.json"; // all dev logs

async function loadDevLogs() {
  try {
    const response = await fetch(logFilePath);
    const data = await response.json();
    const allLogs = data.logs;

    logsContainer.innerHTML = ""; // clear previous logs

    for (const log of allLogs) {
      // Log title
      const titleDiv = document.createElement("div");
      titleDiv.classList.add("log-entry");
      titleDiv.textContent = `[${log.date}] ${log.title}`;
      logsContainer.appendChild(titleDiv);

      // Animate entries line by line
      for (const entry of log.entries) {
        await animateLogEntry(entry, logsContainer);
      }
    }
  } catch (err) {
    console.error("Failed to load dev logs:", err);
    logsContainer.textContent = "Error loading dev logs.";
  }
}

function animateLogEntry(text, container) {
  return new Promise(res => {
    const maxChars = 60;
    let start = 0;

    function appendLine() {
      if (start < text.length) {
        const line = text.slice(start, start + maxChars);
        const div = document.createElement("div");
        div.classList.add("log-entry");
        div.textContent = line;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        start += maxChars;
        setTimeout(appendLine, 50);
      } else {
        res();
      }
    }

    appendLine();
  });
}

// Start loading logs
loadDevLogs();
