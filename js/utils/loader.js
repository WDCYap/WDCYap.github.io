export function loadCSS(path) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${path}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;

    link.onload = resolve;
    link.onerror = () => reject(new Error(`Failed to load ${path}`));

    document.head.appendChild(link);
  });
}
