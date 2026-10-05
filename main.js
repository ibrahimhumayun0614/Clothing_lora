const header = document.querySelector("[data-header]");
const searchToggle = document.querySelector("[data-search-toggle]");
const searchPanel = document.querySelector("[data-search-panel]");
const searchInput = document.querySelector("[data-search-input]");
const searchClose = document.querySelector("[data-search-close]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function setSearchOpen(isOpen) {
  searchPanel.hidden = !isOpen;
  searchToggle.setAttribute("aria-expanded", String(isOpen));
  header.classList.toggle("is-searching", isOpen);

  if (isOpen) {
    searchInput.focus();
  }
}

function setMenuOpen(isOpen) {
  nav.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

searchToggle.addEventListener("click", () => {
  setSearchOpen(searchPanel.hidden);
});

searchClose.addEventListener("click", () => {
  setSearchOpen(false);
  searchToggle.focus();
});

searchPanel.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  const categories = ["men", "women", "girls", "boys", "kids"];
  const match = categories.find((category) => query.includes(category));

  if (match) {
    setSearchOpen(false);
    const target = document.getElementById(match);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = "index.html#" + match;
    }
  }
});

menuToggle.addEventListener("click", () => {
  setMenuOpen(!nav.classList.contains("is-open"));
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!searchPanel.hidden) {
      setSearchOpen(false);
      searchToggle.focus();
    }
    setMenuOpen(false);
  }
});

document.addEventListener("click", (event) => {
  if (!header.contains(event.target)) {
    setMenuOpen(false);
  }
});

document.querySelectorAll(".wish").forEach((button) => {
  button.addEventListener("click", () => {
    const pressed = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!pressed));
  });
});

const sellers = document.querySelector("[data-sellers]");
const sellersNext = document.querySelector("[data-sellers-next]");

if (sellers && sellersNext) {
let sellerDrag = null;

sellers.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || event.target.closest("button")) return;

  sellerDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startScroll: sellers.scrollLeft,
    moved: false,
  };
  sellers.setPointerCapture(event.pointerId);
});

sellers.addEventListener("pointermove", (event) => {
  if (!sellerDrag || event.pointerId !== sellerDrag.pointerId) return;

  const distance = event.clientX - sellerDrag.startX;
  if (Math.abs(distance) > 3) {
    sellerDrag.moved = true;
    sellers.classList.add("is-dragging");
  }

  sellers.scrollLeft = sellerDrag.startScroll - distance;
});

function endSellerDrag(event) {
  if (!sellerDrag || event.pointerId !== sellerDrag.pointerId) return;

  const moved = sellerDrag.moved;
  sellerDrag = null;
  sellers.classList.remove("is-dragging");

  if (moved) {
    sellers.dataset.dragged = "true";
  }
}

sellers.addEventListener("pointerup", endSellerDrag);
sellers.addEventListener("pointercancel", endSellerDrag);

sellers.addEventListener(
  "click",
  (event) => {
    if (sellers.dataset.dragged !== "true") return;
    event.preventDefault();
    event.stopPropagation();
    delete sellers.dataset.dragged;
  },
  true
);

sellersNext.addEventListener("click", () => {
  const card = sellers.querySelector(".product");
  const gap = parseFloat(getComputedStyle(sellers).columnGap || getComputedStyle(sellers).gap) || 0;
  const amount = card.getBoundingClientRect().width + gap;
  const maxScroll = sellers.scrollWidth - sellers.clientWidth;

  if (sellers.scrollLeft >= maxScroll - 4) {
    sellers.scrollTo({ left: 0, behavior: "smooth" });
    return;
  }

  sellers.scrollBy({ left: amount, behavior: "smooth" });
});
}
