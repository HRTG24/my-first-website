// Elements used on both pages
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle (remember choice)
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme") || "light";
root.setAttribute("data-theme", savedTheme);

const toggleThemeBtn = document.getElementById("toggle-theme");
if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

// Home page widgets
const countEl = document.getElementById("count");
const addBtn = document.getElementById("add");
const resetBtn = document.getElementById("reset");
if (countEl && addBtn && resetBtn) {
  let count = 0;
  countEl.textContent = count.toString();

  addBtn.addEventListener("click", () => {
    count += 1;
    countEl.textContent = count.toString();
  });
  resetBtn.addEventListener("click", () => {
    count = 0;
    countEl.textContent = count.toString();
  });
}

// Live clock (only on Home where #clock exists)
const clockEl = document.getElementById("clock");
if (clockEl) {
  const updateClock = () => {
    clockEl.textContent = new Date().toLocaleTimeString();
  };
  updateClock();
  setInterval(updateClock, 1000);
  //Create a button to toggle the clock visibility
  const toggleClockBtn = document.createElement("button");
  toggleClockBtn.textContent = "Toggle Clock"; // Set button text
  toggleClockBtn.className = "btn"; // Optional: Add a class for styling

  // Append the button to an existing element in the DOM
  const container = document.querySelector(".container"); // Adjust selector as needed
  if (container) {
    container.appendChild(toggleClockBtn);
  }

  toggleClockBtn.addEventListener("click", () => {
    if (clockEl) {
      clockEl.style.display = clockEl.style.display === "none" ? "block" : "none";
    }
  });
}
