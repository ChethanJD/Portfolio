// Profile personalization: ?profile=recruiter|developer|adventurer|visitor
(function () {
  const CONFIG = {
    recruiter: { label: "Recruiter", video: "assets/videos/recruiter.mp4", fallback: "https://cdn.coverr.co/videos/coverr-working-at-the-office-1584/1080p.mp4", image: "assets/profiles/recruiter.svg" },
    developer: { label: "Developer", video: "assets/videos/developer.mp4", fallback: "https://cdn.coverr.co/videos/coverr-typing-on-a-keyboard-1587/1080p.mp4", image: "assets/profiles/developer.svg" },
    adventurer: { label: "Adventurer", video: "assets/videos/adventurer.mp4", fallback: "https://cdn.coverr.co/videos/coverr-mountain-landscape-1569/1080p.mp4", image: "assets/profiles/adventurer.svg" },
    visitor: { label: "Visitor", video: "assets/videos/visitor.mp4", fallback: "https://cdn.coverr.co/videos/coverr-city-night-1537/1080p.mp4", image: "assets/profiles/visitor.svg" }
  };
  const params = new URLSearchParams(window.location.search);
  const key = (params.get("profile") || "recruiter").toLowerCase();
  const cfg = CONFIG[key] || CONFIG.recruiter;

  const nameEl = document.getElementById("profile-name");
  if (nameEl) nameEl.textContent = cfg.label;

  const navImg = document.getElementById("nav-profile-img");
  if (navImg) { navImg.src = cfg.image; navImg.alt = cfg.label; navImg.onerror = () => { navImg.style.display = "none"; }; }

  const video = document.getElementById("bg-video");
  const srcLocal = document.getElementById("bg-video-src-local");
  const srcFallback = document.getElementById("bg-video-src-fallback");
  if (video) {
    if (srcLocal) srcLocal.src = cfg.video;
    if (srcFallback) srcFallback.src = cfg.fallback;
    video.load();
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
    video.addEventListener("error", () => { const wrap = document.querySelector(".bg-video-container"); if (wrap) wrap.style.display = "none"; }, true);
  }
})();
