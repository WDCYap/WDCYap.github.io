export default function createSplitLayout(data) {
  const row = document.createElement("div");
  row.className = `row align-items-center ${data.id}-layout`;

  const leftCol = document.createElement("div");
  leftCol.className = `col-lg-6 ${data.id}-left`;

  if (data.left.items) {
    createSkillsColumn(leftCol, data.left, data.id);
  } else {
    createContentColumn(leftCol, data.left, data.id);
  }

  const rightCol = document.createElement("div");
  rightCol.className = `col-lg-6 ${data.id}-right`;

  if (data.right.image) {
    createImageColumn(rightCol, data.right, data.id);
  } else if (data.right.items) {
    createSkillsColumn(rightCol, data.right, data.id);
  }

  row.append(leftCol, rightCol);
  return row;
}

function createSkillsColumn(column, data, sectionId) {
  const heading = document.createElement("h3");
  heading.className = `${sectionId}-heading`;
  heading.textContent = data.heading;

  const list = document.createElement("div");
  list.className = `${sectionId}-list`;

  data.items.forEach((item) => {
    const skill = document.createElement("span");
    skill.className = "skill-tag";
    skill.textContent = item;
    list.appendChild(skill);
  });

  column.append(heading, list);
}

function createContentColumn(column, data, sectionId) {
  if (data.heading) {
    const heading = document.createElement("h2");
    heading.className = `${sectionId}-heading`;
    heading.textContent = data.heading;
    column.appendChild(heading);
  }

  if (data.typingText) {
    const typingContainer = document.createElement("div");
    typingContainer.id = "typed-text";
    typingContainer.className = `${sectionId}-typing`;
    typingContainer.dataset.texts = JSON.stringify(data.typingText);
    column.appendChild(typingContainer);
  }

  if (data.description) {
    data.description.forEach((text) => {
      const p = document.createElement("p");
      p.className = `${sectionId}-description`;
      p.textContent = text;
      column.appendChild(p);
    });
  }
}

function createImageColumn(column, data, sectionId) {
  const img = document.createElement("img");
  img.className = "profile-image";
  img.dataset.images = JSON.stringify(data.image);
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  img.src = data.image[currentTheme];
  img.alt = "Profile";
  column.appendChild(img);
}
