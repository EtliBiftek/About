document.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains("copy-btn")) return;

  const targetSelector = target.getAttribute("data-copy-target");
  const explicitText = target.getAttribute("data-copy-text");

  let textToCopy = explicitText || "";
  if (!textToCopy && targetSelector) {
    const el = document.querySelector(targetSelector);
    if (el) {
      textToCopy = el.textContent || "";
    }
  }

  if (!textToCopy.trim()) return;

  try {
    await navigator.clipboard.writeText(textToCopy.trim());
    target.textContent = "Copied";
    setTimeout(() => (target.textContent = "Copy"), 1200);
  } catch (err) {
    console.error("Copy Error", err);
  }
});


