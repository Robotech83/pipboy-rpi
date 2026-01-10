// ======================================================
// TAB NAVIGATION LOGIC
// ======================================================

// Get all tab buttons and screens
const tabs = document.querySelectorAll(".tab");
const screens = document.querySelectorAll(".screen");

// Handle tab clicks
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    
    // Remove active state from all tabs
    tabs.forEach(t => t.classList.remove("active"));
    
    // Hide all screens
    screens.forEach(s => s.classList.remove("active"));
    
    // Activate clicked tab
    tab.classList.add("active");
    
    // FIXED: Check if target element exists before trying to access it
    const targetScreen = document.getElementById(target);
    
    if (targetScreen) {
      // Show matching screen if it exists
      targetScreen.classList.add("active");
    } else {
      // Log warning for debugging
      console.warn(`Tab target element with ID "${target}" not found in the DOM`);
    }
  });
});