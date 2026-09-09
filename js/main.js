/* Back to top */
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  window.addEventListener("scroll", () => { backToTopBtn.style.display = window.pageYOffset > 300 ? "block" : "none"; });
  backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* Typing animation */
const el = document.querySelector(".type-once .text");
let typingIndex = 0, typingForward = true;
function typeLoop() {
  if (!el) return;
  const text = el.dataset.typingText || "Nagy Elgohary";
  el.textContent = typingForward ? text.slice(0, ++typingIndex) : text.slice(0, --typingIndex);
  if (typingIndex === text.length) { typingForward = false; return setTimeout(typeLoop, 1000); }
  if (typingIndex === 0) { typingForward = true; return setTimeout(typeLoop, 500); }
  setTimeout(typeLoop, typingForward ? 120 : 60);
}
typeLoop();

document.querySelectorAll(".item").forEach((item) => { const link = item.querySelector("a"); if (link) item.addEventListener("click", () => { window.location = link.href; }); });

/* Mobile canvas menu */
const menuBtn = document.getElementById("menu-btn"), canvasMenu = document.getElementById("canvas-menu"), openIcon = document.getElementById("open-icon"), closeIcon = document.getElementById("close-icon"), overlay = document.getElementById("canvas-overlay");
if (menuBtn && canvasMenu && overlay) {
  const canvasLinks = canvasMenu.querySelectorAll("a");
  menuBtn.addEventListener("click", () => { canvasMenu.classList.add("open"); overlay.classList.add("active"); if(openIcon) openIcon.style.display="none"; if(closeIcon) closeIcon.style.display="block"; document.body.classList.add("no-scroll"); });
  function closeCanvas(){canvasMenu.classList.remove("open");overlay.classList.remove("active");if(openIcon)openIcon.style.display="inline-block";if(closeIcon)closeIcon.style.display="none";document.body.classList.remove("no-scroll");}
  closeIcon?.addEventListener("click", closeCanvas); overlay.addEventListener("click", closeCanvas); canvasLinks.forEach(link=>link.addEventListener("click",closeCanvas));
}
setTimeout(() => document.querySelector(".main-container")?.classList.add("hide"), 2500);

/* Supabase content binding. The existing HTML remains the fallback if the database is unavailable. */
async function loadPortfolioContent() {
  if (!window.supabaseClient) return;
  const { data, error } = await supabaseClient.from("portfolio_content").select("content").order("id").limit(1).maybeSingle();
  if (error || !data?.content) return;
  const c = data.content;
  const setText = (selector, value) => { const node = document.querySelector(selector); if (node && value != null) node.textContent = value; };
  setText(".content .text h2:first-child", c.heroTitle);
  setText(".content .text > p", c.heroSubtitle);
  setText(".navbar .logo h3", c.brand || "Nagy");
  const typeNode = document.querySelector(".type-once .text"); if (typeNode && c.brand) typeNode.dataset.typingText = c.brand;
  if (c.email) document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{a.href=`mailto:${c.email}`});
  if (c.facebook) document.querySelectorAll('a[href*="facebook.com"]').forEach(a=>a.href=c.facebook);
  if (c.linkedin) document.querySelectorAll('a[href*="linkedin.com"]').forEach(a=>a.href=c.linkedin);
  const stats = c.stats || {};
  ["years","words","clients"].forEach((key,i)=>{const node=document.querySelectorAll(".stats .stat b")[i];if(node && stats[key])node.textContent=stats[key]});
  if (Array.isArray(c.quickFacts)) document.querySelectorAll(".info-card .ab li").forEach((node,i)=>{if(c.quickFacts[i])node.textContent=c.quickFacts[i]});
  if (Array.isArray(c.about)) document.querySelectorAll(".about-col-2 .aft").forEach((node,i)=>{if(c.about[i])node.textContent=c.about[i]});
  if (Array.isArray(c.skills)) document.querySelectorAll(".skills .skill p").forEach((node,i)=>{if(c.skills[i])node.textContent=c.skills[i]});
  if (Array.isArray(c.services)) document.querySelectorAll(".services-list > div").forEach((node,i)=>{const item=c.services[i];if(!item)return;if(item.title)node.querySelector("h2").textContent=item.title;if(item.description)node.querySelector("p").textContent=item.description});
  if (Array.isArray(c.portfolio)) document.querySelectorAll(".portfolio .item").forEach((node,i)=>{const item=c.portfolio[i];if(!item)return;if(item.title)node.querySelector("h3").textContent=item.title;if(item.url)node.querySelector("a").href=item.url;if(item.image)node.querySelector("img").src=item.image});
}
loadPortfolioContent();

/* Contact submissions are stored in Supabase until email delivery is connected. */
const contactForm = document.getElementById("contactForm");
if (contactForm && window.supabaseClient) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("contactStatus");
    const submitButton = contactForm.querySelector("button[type=submit]");
    const formData = new FormData(contactForm);
    const files = [...(document.getElementById("documents")?.files || [])];
    const allowed = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (files.some(file => !allowed.includes(file.type) || file.size > 10 * 1024 * 1024)) {
      status.textContent = "Please upload PDF, JPG, PNG, or DOC files up to 10 MB each.";
      return;
    }
    submitButton.disabled = true;
    status.textContent = "Sending…";
    const filePaths = [];
    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${crypto.randomUUID()}-${safeName}`;
      const upload = await supabaseClient.storage.from("contact-documents").upload(path, file, { upsert: false });
      if (upload.error) { status.textContent = upload.error.message; submitButton.disabled = false; return; }
      filePaths.push({ path, name: file.name, type: file.type, size: file.size });
    }
    const submission = {
      name: formData.get("name"), email: formData.get("email"), country_code: formData.get("country_code"),
      phone: formData.get("phone"), message: formData.get("Message"), file_paths: filePaths
    };
    const { error } = await supabaseClient.from("contact_submissions").insert(submission);
    if (error) { status.textContent = error.message; submitButton.disabled = false; return; }
    contactForm.reset();
    status.textContent = "Your message and documents were received successfully.";
    submitButton.disabled = false;
  });
}
