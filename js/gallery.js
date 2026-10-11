// Accessible lightbox with keyboard nav (used by about.html gallery)
(function () {
  const galleryImages = [];
  document.querySelectorAll("[data-lightbox]").forEach((img, idx) => {
    galleryImages.push({ src: img.src, alt: img.alt || "" });
    img.addEventListener("click", () => openLightbox(idx));
    img.setAttribute("tabindex", "0");
    img.addEventListener("keydown", (e) => { if (e.key === "Enter") openLightbox(idx); });
  });
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("lightboxImage");
  const caption = document.getElementById("lightboxCaption");
  if (!lightbox || !lightboxImg) return;
  let current = 0;

  window.openLightbox = function (i) {
    current = (i + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[current].src;
    lightboxImg.alt = galleryImages[current].alt;
    if (caption) caption.textContent = galleryImages[current].alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };
  window.closeLightbox = function () {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };
  window.navigateLightbox = function (dir) { window.openLightbox(current + dir); };

  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) window.closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") window.closeLightbox();
    if (e.key === "ArrowRight") window.navigateLightbox(1);
    if (e.key === "ArrowLeft") window.navigateLightbox(-1);
  });
})();

// Copy buttons for project install blocks
function copyCode(btn) {
  const block = btn.closest(".code-block");
  const code = block ? block.querySelector("code") : null;
  const text = code ? code.innerText : block.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  }).catch(() => { btn.textContent = "Select + Ctrl+C"; });
}
