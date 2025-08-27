/*  Start Back To Top Button */

const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* End Back To Top Button */

/*  Start Animation Typing */

const el = document.querySelector(".type-once .text");
const text = "Nagy Elgohary";
let i = 0;
let typing = true;

function typeLoop() {
  if (typing) {
    el.textContent = text.slice(0, ++i);
    if (i === text.length) {
      typing = false;
      return setTimeout(typeLoop, 1000);
    }
  } else {
    el.textContent = text.slice(0, --i);
    if (i === 0) {
      typing = true;
      return setTimeout(typeLoop, 500);
    }
  }
  setTimeout(typeLoop, typing ? 120 : 60);
}
typeLoop();

/*  End Animation Typing */

document.querySelectorAll(".item").forEach((item) => {
  let link = item.querySelector("a");
  if (link) {
    item.addEventListener("click", () => {
      window.location = link.href;
    });
  }
});

// Start Canvas //

const menuBtn = document.getElementById("menu-btn");
const canvasMenu = document.getElementById("canvas-menu");
const openIcon = document.getElementById("open-icon");
const closeIcon = document.getElementById("close-icon");
const overlay = document.getElementById("canvas-overlay");
const canvasLinks = canvasMenu.querySelectorAll("a"); // كل اللينكات داخل الـ canvas

menuBtn.addEventListener("click", () => {
  canvasMenu.classList.add("open");
  overlay.classList.add("active");
  openIcon.style.display = "none";
  closeIcon.style.display = "block";
  document.body.classList.add("no-scroll");
});

function closeCanvas() {
  canvasMenu.classList.remove("open");
  overlay.classList.remove("active");
  openIcon.style.display = "inline-block";
  closeIcon.style.display = "none";
  document.body.classList.remove("no-scroll");
}

closeIcon.addEventListener("click", closeCanvas);
overlay.addEventListener("click", closeCanvas);

canvasLinks.forEach((link) => {
  link.addEventListener("click", closeCanvas);
});
