import {
  initializeTypingAnimations,
  initializeProfileImage,
  updateProfileImage,
} from "./utils/animations.js";
import { loadCSS } from "./utils/loader.js";
import { createResumeModal } from "./utils/modal.js";
import {
  ANIMATION_DURATION,
  TYPING_SPEED,
  SCROLL_THRESHOLD,
  INTERSECTION_OPTIONS,
} from "./utils/constants.js";

function initializeTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = localStorage.getItem("theme");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeIcon(theme);
    updateProfileImage(theme);
  }

  setTheme(savedTheme || (prefersDark.matches ? "dark" : "light"));
  prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) setTheme(e.matches ? "dark" : "light");
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector(".theme-toggle i");
  icon.classList.remove("fa-sun", "fa-moon");
  icon.classList.add(theme === "dark" ? "fa-sun" : "fa-moon");
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
  updateProfileImage(newTheme);
}

function typeLoadingText() {
  return fetch("assets/data.json")
    .then((response) => response.json())
    .then((data) => {
      const loadingText = document.getElementById("loading-text");
      let index = 0;

      return new Promise((resolve) => {
        function type() {
          if (index < data.site.brand.length) {
            loadingText.textContent += data.site.brand.charAt(index++);
            setTimeout(type, TYPING_SPEED.type);
          } else setTimeout(resolve, TYPING_SPEED.pause);
        }
        type();
      });
    });
}

function showPage() {
  const loadingScreen = document.getElementById("loading-screen");
  document.querySelectorAll("section").forEach((section) => {
    section.style.opacity = "0";
    section.style.visibility = "hidden";
  });

  loadingScreen.style.opacity = "0";
  setTimeout(() => {
    loadingScreen.style.display = "none";
    setTimeout(startPageAnimations, ANIMATION_DURATION / 3);
  }, ANIMATION_DURATION);
}

function initializeNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > SCROLL_THRESHOLD);
  });
}

function updateNavigation(sections) {
  const navList = document.querySelector(".navbar-nav");
  const themeToggle = navList.querySelector(".nav-item");
  navList.innerHTML = "";

  sections.forEach((section) => {
    if (section.show && section.nav) {
      const li = document.createElement("li");
      li.className = "nav-item";

      const a = document.createElement("a");
      a.className = "nav-link";
      a.href = `#${section.id}`;
      a.textContent = section.id.charAt(0).toUpperCase() + section.id.slice(1);

      a.addEventListener("click", (e) => handleNavigation(e, `#${section.id}`));

      li.appendChild(a);
      navList.appendChild(li);
    }
  });

  navList.appendChild(themeToggle);
}

function startPageAnimations() {
  document.querySelectorAll("section").forEach((section) => {
    section.style.opacity = "1";
    section.style.transform = "translateY(0)";
    section.style.visibility = "visible";
  });
  initializeTypingAnimations();
  initializeProfileImage();
}

function updateSiteMetadata(siteData) {
  document.title = siteData.title;
  document.querySelector(".navbar-brand").textContent = siteData.brand;

  if (siteData.favicon) {
    const favicon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    favicon.type = "image/x-icon";
    favicon.rel = "icon";
    favicon.href = siteData.favicon;
    if (!document.querySelector("link[rel='icon']")) {
      document.head.appendChild(favicon);
    }
  }

  if (siteData.footer?.show) {
    const footer = document.createElement("footer");
    footer.className = "text-center py-4";
    const small = document.createElement("small");
    small.textContent = siteData.footer.text;
    footer.appendChild(small);
    document.body.appendChild(footer);
  }
}

async function renderContent(data) {
  const sectionsContainer = document.getElementById("sections-container");
  sectionsContainer.innerHTML = "";

  if (
    data.sections.some(
      (section) =>
        section.layout === "list" &&
        section.items?.some((item) => item.type === "resume")
    )
  ) {
    createResumeModal();
  }

  for (const section of data.sections) {
    if (section.show) {
      sectionsContainer.appendChild(await createSection(section));
    }
  }

  handleSectionVisibility();
}

async function createSection(sectionData) {
  const section = document.createElement("section");
  section.id = sectionData.id;
  section.className = `${sectionData.id}-section`;

  const container = document.createElement("div");
  container.className = "container";

  if (sectionData.title) {
    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = sectionData.title;
    container.appendChild(title);
  }

  try {
    try {
      const sectionModule = await import(`./sections/${sectionData.id}.js`);
      const content = await sectionModule.default(sectionData);
      container.appendChild(content);
    } catch (error) {
      console.log(
        `No specific module for section: ${sectionData.id}, using layout`
      );
      const layoutModule = await import(`./layouts/${sectionData.layout}.js`);
      const content = layoutModule.default(sectionData);
      container.appendChild(content);
    }

    await loadCSS(`css/layouts/${sectionData.layout}.css`);

    try {
      await loadCSS(`css/sections/${sectionData.id}.css`);
    } catch (error) {
      console.log(`No specific CSS for section: ${sectionData.id}`);
    }
  } catch (error) {
    console.error(`Error loading section/layout: ${error.message}`);
    container.innerHTML += `<p>Error loading section ${sectionData.id}</p>`;
  }

  container.querySelectorAll('a[href^="#"]').forEach((link) => {
    const targetId = link.getAttribute("href");
    if (targetId !== "#" && document.querySelector(`section${targetId}`)) {
      link.addEventListener("click", (e) => handleNavigation(e, targetId));
    }
  });

  section.appendChild(container);
  return section;
}

function handleSectionVisibility() {
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, INTERSECTION_OPTIONS);

  const aboutSection = document.querySelector("#about");
  if (aboutSection) {
    aboutSection.classList.add("visible");
  }

  sections.forEach((section) => {
    if (section.id !== "about") {
      observer.observe(section);
    }
  });
}

function handleNavigation(event, targetId) {
  event.preventDefault();
  const targetSection = document.querySelector(targetId);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeNavbarScroll();

  document
    .querySelector(".theme-toggle")
    .addEventListener("click", toggleTheme);

  Promise.all([
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener("load", resolve)),
    typeLoadingText(),
  ]).then(() => {
    fetch("assets/data.json")
      .then((response) => response.json())
      .then((data) => {
        updateSiteMetadata(data.site);
        updateNavigation(data.sections);
        renderContent(data).then(() => {
          showPage();
        });
      })
      .catch((error) => console.error("Error loading data:", error));
  });
});
