// AFSNIT 01 – PWA-installation
let deferredPrompt = null;

export function initPwaInstall(button) {
  if (!button) return;

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    button.hidden = false;
  });

  button.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    button.hidden = true;
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(error => {
        console.warn("Service worker kunne ikke registreres", error);
      });
    });
  }
}
