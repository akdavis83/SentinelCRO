const nav = document.querySelector("nav");
let currentLink = nav.querySelector("a"); // Initialize with the first link
const DELAY = 250; // delay between updating sides

// last detected flex-direction 
let lastFlexDirection = getComputedStyle(nav).flexDirection;
console.log(lastFlexDirection);

// Debounce function to limit how often a function can be called
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}


// update indicator based on lastFlexDirection
function updateIndicator(clickedLink) {
  const style = window.getComputedStyle(nav);
  const parentRect = nav.getBoundingClientRect();

  if (lastFlexDirection==="column") {
    // Reset left and right values for column mode
    nav.style.setProperty("--_nav-indicator-left", "0");
    nav.style.setProperty("--_nav-indicator-right", "0");

    // Calculate top and bottom values
    const offsetStart = clickedLink.offsetTop;
    const offsetSize = clickedLink.offsetHeight;
    const end = parentRect.height - (offsetStart + offsetSize);

    if (Array.from(nav.children).indexOf(clickedLink) < Array.from(nav.children).indexOf(currentLink)) {
      nav.style.setProperty("--_nav-indicator-top", `${offsetStart}px`);
      setTimeout(() => {
        nav.style.setProperty("--_nav-indicator-bottom", `${end}px`);
      }, DELAY);
    } else {
      nav.style.setProperty("--_nav-indicator-bottom", `${end}px`);
      setTimeout(() => {
        nav.style.setProperty("--_nav-indicator-top", `${offsetStart}px`);
      }, DELAY);
    }
  } else {
    // Reset top and bottom values for row mode
    nav.style.setProperty("--_nav-indicator-top", "0");
    nav.style.setProperty("--_nav-indicator-bottom", "0");

    // Calculate left and right values
    const offsetStart = clickedLink.offsetLeft;
    const offsetSize = clickedLink.offsetWidth;
    const end = parentRect.width - (offsetStart + offsetSize);

    if (Array.from(nav.children).indexOf(clickedLink) < Array.from(nav.children).indexOf(currentLink)) {
      nav.style.setProperty("--_nav-indicator-left", `${offsetStart}px`);
      setTimeout(() => {
        nav.style.setProperty("--_nav-indicator-right", `${end}px`);
      }, DELAY);
    } else {
      nav.style.setProperty("--_nav-indicator-right", `${end}px`);
      setTimeout(() => {
        nav.style.setProperty("--_nav-indicator-left", `${offsetStart}px`);
      }, DELAY);
    }
  }

  currentLink = clickedLink;
}

// Debounce
const handleClick = debounce((e) => {
  const clickedLink = e.target.closest("a");
  if (clickedLink && clickedLink !== currentLink) {
    updateIndicator(clickedLink);
  }
}, 150);

// check for flex-direction changes and re-update indicator if needed
function handleResize() {
  const currentFlexDirection = getComputedStyle(nav).flexDirection;
  // only do the calculations again if the flex direction has changed
  if (currentFlexDirection !== lastFlexDirection) {
    lastFlexDirection = currentFlexDirection;
    updateIndicator(currentLink);
  }
}

// click event handler
nav.addEventListener("click", handleClick);

// resize - really just in case the flex-direction has changed
window.addEventListener("resize", debounce(handleResize, 100));

// initial position for the first link
if (currentLink) {
  updateIndicator(currentLink);
}