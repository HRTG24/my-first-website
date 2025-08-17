const countEl = document.getElementById("count");
const addBtn = document.getElementById("add");
const resetBtn = document.getElementById("reset");
const toggleThemeBtn = document.getElementById("toggle-theme");
const yearEl = document.getElementById("year");

let count = 0;
countEl.textContent = count;
yearEl.textContent = new Date().getFullYear();

// Counter behavior
addBtn.addEventListener("click", () => {
  count += 1;
  countEl.textContent = count;
});

resetBtn.addEventListener("click", () => {
  count = 0;
  countEl.textContent = count;
});

// Theme toggle (remembers choice)
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.setAttribute("data-theme", savedTheme);

toggleThemeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});
