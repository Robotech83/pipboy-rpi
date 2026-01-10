async function updateStats() {
  const res = await fetch("http://127.0.0.1:8000/api/stats");
  const data = await res.json();

  document.getElementById("hp").style.width = data.hp + "%";
  document.getElementById("ap").style.width = data.ap + "%";
  document.getElementById("rads").style.width = Math.min(data.rads, 100) + "%";

  document.getElementById("cpu").innerText = data.cpu.toFixed(1);
  document.getElementById("ram").innerText = data.ram.toFixed(1);
  document.getElementById("disk").innerText = data.disk.toFixed(1);
}

setInterval(updateStats, 1000);
updateStats();
