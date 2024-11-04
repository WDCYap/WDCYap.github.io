function initializeTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeIcon(theme);
    updateProfileImage(theme);
  }

  function handleSystemThemeChange(e) {
    const newTheme = e.matches ? "dark" : "light";
    setTheme(newTheme);
  }

  const theme = prefersDark.matches ? "dark" : "light";
  setTheme(theme);

  prefersDark.addEventListener("change", handleSystemThemeChange);
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

document.addEventListener("DOMContentLoaded", initializeTheme);

function typeLoadingText() {
  return fetch("assets/data.json")
    .then((response) => response.json())
    .then((data) => {
      const text = data.site.brand || "PROTO//FOLIO";
      const loadingText = document.getElementById("loading-text");
      let index = 0;

      return new Promise((resolve) => {
        function type() {
          if (index < text.length) {
            loadingText.textContent += text.charAt(index);
            index++;
            setTimeout(type, 150);
          } else {
            setTimeout(resolve, 500);
          }
        }
        type();
      });
    });
}

function showPage() {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.style.opacity = "0";
  loadingScreen.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    loadingScreen.style.display = "none";
    startPageAnimations();
  }, 500);
}

function startPageAnimations() {
  const profileImage = document.querySelector(".profile-image");
  if (profileImage) {
    profileImage.classList.add("animate");
  }

  const typedTextElement = document.getElementById("typed-text");
  if (typedTextElement) {
    fetch("assets/data.json")
      .then((response) => response.json())
      .then((data) => {
        if (data.about && data.about.titles) {
          typeText(data.about.titles);
        }
      });
  }

  handleSectionVisibility();
}

function loadImages() {
  return new Promise((resolve) => {
    fetch("assets/data.json")
      .then((response) => response.json())
      .then((data) => {
        const imagesToLoad = [];

        if (data.about && data.about.image) {
          imagesToLoad.push(data.about.image.light);
          imagesToLoad.push(data.about.image.dark);
        }

        if (data.projects && data.projects.items) {
          data.projects.items.forEach((project) => {
            if (project.image) {
              imagesToLoad.push(project.image);
            }
          });
        }

        const imagePromises = imagesToLoad.map((imageSrc) => {
          return new Promise((resolveImage) => {
            const img = new Image();
            img.onload = resolveImage;
            img.onerror = resolveImage;
            img.src = imageSrc;
          });
        });

        Promise.all(imagePromises).then(resolve);
      })
      .catch((error) => {
        console.error("Error loading images:", error);
        resolve();
      });
  });
}

Promise.all([
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise((resolve) => window.addEventListener("load", resolve)),
  loadImages(),
  typeLoadingText(),
]).then(showPage);

const themeToggle = document.querySelector(".theme-toggle");
const icon = themeToggle.querySelector("i");

themeToggle.addEventListener("click", toggleTheme);

function typeText(texts) {
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedTextElement = document.getElementById("typed-text");

  typedTextElement.textContent = texts[textIndex] + "\u00A0";

  typedTextElement.style.overflow = "hidden";
  typedTextElement.style.whiteSpace = "nowrap";
  typedTextElement.style.display = "inline-block";

  function type() {
    typedTextElement.textContent =
      texts[textIndex].substring(0, charIndex) + "\u00A0";

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    if (!isDeleting && charIndex === texts[textIndex].length) {
      setTimeout(() => (isDeleting = true), 1500);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    const typingSpeed = isDeleting ? 100 : 200;
    setTimeout(type, typingSpeed);
  }

  type();
}

fetch("assets/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Fetched Data:", data);

    const sectionsContainer = document.getElementById("sections-container");

    if (data.about) {
      renderSection("about", data.about);
    }
    if (data.education) {
      renderSection("education", data.education);
    }
    if (data.experience) {
      renderSection("experience", data.experience);
    }
    if (data.skills) {
      renderSection("skills", data.skills);
    }
    if (data.projects) {
      renderProjects(data.projects);
      document.getElementById("projects").style.display = "block";
    }

    if (data.contact) {
      renderContact(data.contact);
      document.getElementById("contact").style.display = "block";
    }

    if (data.site) {
      if (data.site.title) {
        document.getElementById("site-title").textContent = data.site.title;
        document.title = data.site.title;
      }
      if (data.site.brand) {
        document.querySelector(".navbar-brand").textContent = data.site.brand;
      }
      if (data.site.favicon) {
        const favicon =
          document.querySelector("link[rel='icon']") ||
          document.createElement("link");
        favicon.type = "image/x-icon";
        favicon.rel = "icon";
        favicon.href = data.site.favicon;
        if (!document.querySelector("link[rel='icon']")) {
          document.head.appendChild(favicon);
        }
      }
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function renderSection(id, sectionData) {
  const section = document.createElement("section");
  section.id = id;

  if (id === "about") {
    section.classList.add("visible");
  }

  const container = document.createElement("div");
  container.className = "container";

  if (id === "about") {
    const aboutContainer = document.createElement("div");
    aboutContainer.className = "row align-items-center";

    const aboutText = document.createElement("div");
    aboutText.className = "col-lg-6";

    const aboutTitle = document.createElement("h1");
    aboutTitle.className = "display-4 mb-4";
    aboutTitle.textContent = sectionData.title;

    const aboutTypedText = document.createElement("div");
    aboutTypedText.className = "h4 mb-4";
    aboutTypedText.id = "typed-text";

    const aboutDescription = document.createElement("div");
    aboutDescription.className = "lead";
    sectionData.description.forEach((desc) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = desc;
      aboutDescription.appendChild(paragraph);
    });

    aboutText.appendChild(aboutTitle);
    aboutText.appendChild(aboutTypedText);
    aboutText.appendChild(aboutDescription);

    const aboutImage = document.createElement("div");
    aboutImage.className = "col-lg-6";

    const imageContainer = document.createElement("div");
    imageContainer.className = "about-image-container";

    const profileImage = document.createElement("img");
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    profileImage.src = sectionData.image[currentTheme];
    profileImage.alt = "Profile";
    profileImage.className = "profile-image";

    imageContainer.appendChild(profileImage);
    aboutImage.appendChild(imageContainer);

    aboutContainer.appendChild(aboutText);
    aboutContainer.appendChild(aboutImage);
    container.appendChild(aboutContainer);
  } else if (id === "education" || id === "experience") {
    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = sectionData.title;
    container.appendChild(sectionTitle);

    const timeline = document.createElement("div");
    timeline.className = "timeline";

    sectionData.items.forEach((item) => {
      const timelineItem = document.createElement("div");
      timelineItem.className = "timeline-item";

      const itemTitle = document.createElement("h4");
      itemTitle.textContent = item.title;

      const itemPlace = document.createElement("p");
      itemPlace.className = id === "education" ? "institution" : "company";
      itemPlace.textContent =
        item[id === "education" ? "institution" : "company"];

      const itemDate = document.createElement("p");
      itemDate.className = "date";
      itemDate.textContent = item.date;

      const itemDescription = document.createElement("div");
      item.description.forEach((desc) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = desc;
        itemDescription.appendChild(paragraph);
      });

      timelineItem.appendChild(itemTitle);
      timelineItem.appendChild(itemPlace);
      timelineItem.appendChild(itemDate);
      timelineItem.appendChild(itemDescription);
      timeline.appendChild(timelineItem);
    });

    container.appendChild(timeline);
  } else if (id === "skills") {
    const skillsContainer = document.createElement("div");
    skillsContainer.className = "row g-4";

    const technicalSkills = document.createElement("div");
    technicalSkills.className = "col-md-6";

    const technicalSkillsTitle = document.createElement("h4");
    technicalSkillsTitle.textContent = "Technical Skills";

    const technicalSkillsTags = document.createElement("div");
    technicalSkillsTags.className = "d-flex flex-wrap";

    sectionData.technicalSkills.forEach((skill, index) => {
      const skillTag = document.createElement("span");
      skillTag.className = "skill-tag";
      skillTag.style.setProperty("--index", index);
      skillTag.textContent = skill;
      technicalSkillsTags.appendChild(skillTag);
    });

    technicalSkills.appendChild(technicalSkillsTitle);
    technicalSkills.appendChild(technicalSkillsTags);

    const softSkills = document.createElement("div");
    softSkills.className = "col-md-6";

    const softSkillsTitle = document.createElement("h4");
    softSkillsTitle.textContent = "Soft Skills";

    const softSkillsTags = document.createElement("div");
    softSkillsTags.className = "d-flex flex-wrap";

    sectionData.softSkills.forEach((skill) => {
      const skillTag = document.createElement("span");
      skillTag.className = "skill-tag";
      skillTag.textContent = skill;
      softSkillsTags.appendChild(skillTag);
    });

    softSkills.appendChild(softSkillsTitle);
    softSkills.appendChild(softSkillsTags);

    skillsContainer.appendChild(technicalSkills);
    skillsContainer.appendChild(softSkills);
    container.appendChild(skillsContainer);
  }

  section.appendChild(container);
  const sectionsContainer = document.getElementById("sections-container");
  sectionsContainer.appendChild(section);
}

function renderContact(contactData) {
  const contactEmailElement = document.getElementById("contact-email");
  const contactPhoneElement = document.getElementById("contact-phone");
  const contactLinkedInElement = document.getElementById("contact-linkedin");
  const resumeButton = document.getElementById("resume-button");
  const resumePreview = document.getElementById("resume-preview");
  const resumeDownload = document.getElementById("resume-download");

  if (contactData.email) {
    contactEmailElement.textContent = contactData.email;
    contactEmailElement.parentElement.href = `mailto:${contactData.email}`;
  }

  if (contactData.phone) {
    contactPhoneElement.textContent = contactData.phone;
    contactPhoneElement.parentElement.href = `tel:${contactData.phone}`;
  }

  if (contactData.linkedin) {
    contactLinkedInElement.href = contactData.linkedin;
  }

  if (contactData.resume && contactData.resume.show) {
    resumeButton.style.display = "flex";
    resumePreview.src = contactData.resume.file;
    resumeDownload.href = contactData.resume.file;
  }
}

function renderProjects(projectsData) {
  const projectsContainer = document.getElementById("project-items");
  const indicatorsContainer = document.getElementById("project-indicators");

  projectsContainer.innerHTML = "";
  indicatorsContainer.innerHTML = "";

  const visibleProjects = projectsData.items.filter(
    (project) => project.show !== false
  );

  if (visibleProjects.length === 0) {
    document.getElementById("projects").style.display = "none";
    return;
  }

  visibleProjects.forEach((project, index) => {
    const projectItem = document.createElement("div");
    projectItem.className = `carousel-item ${index === 0 ? "active" : ""}`;

    const projectContent = document.createElement("div");
    projectContent.className = "project-content";

    const imageSection = document.createElement("div");
    imageSection.className = "project-image";

    const projectImage = document.createElement("img");
    projectImage.src = project.image;
    projectImage.alt = project.title;
    imageSection.appendChild(projectImage);

    const detailsSection = document.createElement("div");
    detailsSection.className = "project-details";

    const projectTitle = document.createElement("h3");
    projectTitle.className = "mb-3";
    projectTitle.textContent = project.title;

    const projectDescription = document.createElement("div");
    projectDescription.className = "mb-4";
    project.description.forEach((desc) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = desc;
      projectDescription.appendChild(paragraph);
    });

    const toolsList = document.createElement("ul");
    toolsList.className = "project-tools";

    project.tools.forEach((tool) => {
      const toolItem = document.createElement("li");
      toolItem.textContent = tool;
      toolsList.appendChild(toolItem);
    });

    detailsSection.appendChild(projectTitle);
    detailsSection.appendChild(projectDescription);
    detailsSection.appendChild(toolsList);

    if (project.links && project.links.length > 0) {
      const linksContainer = document.createElement("div");
      linksContainer.className = "project-links mt-3";

      project.links.forEach((link) => {
        if (link.show) {
          const linkElement = document.createElement("a");
          linkElement.href = link.url;
          linkElement.className = "btn btn-primary me-2 mb-2";
          linkElement.target = "_blank";
          linkElement.rel = "noopener noreferrer";
          linkElement.textContent = link.text;
          linksContainer.appendChild(linkElement);
        }
      });

      if (linksContainer.children.length > 0) {
        detailsSection.appendChild(linksContainer);
      }
    }

    projectContent.appendChild(imageSection);
    projectContent.appendChild(detailsSection);
    projectItem.appendChild(projectContent);
    projectsContainer.appendChild(projectItem);

    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.setAttribute("data-bs-target", "#projectCarousel");
    indicator.setAttribute("data-bs-slide-to", index.toString());
    if (index === 0) {
      indicator.classList.add("active");
    }
    indicator.setAttribute("aria-label", `Slide ${index + 1}`);

    indicatorsContainer.appendChild(indicator);
  });

  handleProjectLinks();
}

function handleProjectLinks() {
  const projectLinks = document.querySelectorAll(".project-links a");

  projectLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        e.preventDefault();
        const targetSection = document.querySelector(href);

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });
}

function updateProfileImage(theme) {
  fetch("assets/data.json")
    .then((response) => response.json())
    .then((data) => {
      if (data.about && data.about.image) {
        const profileImage = document.querySelector(".profile-image");
        if (profileImage) {
          profileImage.classList.remove("animate");
          profileImage.style.opacity = "0";

          setTimeout(() => {
            profileImage.src = data.about.image[theme];
            void profileImage.offsetWidth;
            profileImage.style.opacity = "1";
            profileImage.classList.add("animate");
          }, 300);
        }
      }
    });
}

function initializeNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  const scrollThreshold = 50;

  function updateNavbar() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbar);
  updateNavbar();
}

function handleSectionVisibility() {
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px",
    }
  );

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

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeNavbarScroll();
  handleSectionVisibility();
});
