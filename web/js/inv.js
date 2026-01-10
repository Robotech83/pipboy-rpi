// ======================================================
// INVENTORY FILE BROWSER LOGIC
// ======================================================

// Current folder path
let currentPath = "";

// DOM elements
const invList = document.getElementById("inv-list");
const invPath = document.getElementById("inv-path");

// Fetch and display inventory
async function loadInventory(path = "") {
  const res = await fetch(
    `http://127.0.0.1:8000/api/inventory?path=${encodeURIComponent(path)}`
  );

  const data = await res.json();

  // Update current path
  currentPath = path;
  invPath.textContent = "/" + path;

  // Clear old list
  invList.innerHTML = "";

  // Add ".." to go back
  if (path !== "") {
    const backItem = document.createElement("li");
    backItem.textContent = "..";
    backItem.className = "folder";

    backItem.onclick = () => {
      const parent = path.split("/").slice(0, -1).join("/");
      loadInventory(parent);
    };

    invList.appendChild(backItem);
  }

  // Render files/folders
  data.items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.name;
    li.className = item.type;

    li.onclick = () => {
      if (item.type === "folder") {
        loadInventory(path ? `${path}/${item.name}` : item.name);
      } else {
        alert(`Selected file: ${item.name}`);
      }
    };

    invList.appendChild(li);
  });
}

// Load inventory when INV tab is first opened
document.querySelector('[data-tab="inv"]').addEventListener("click", () => {
  loadInventory(currentPath);
});
