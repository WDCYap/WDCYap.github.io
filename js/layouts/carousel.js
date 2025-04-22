export default function createCarouselLayout(data) {
  const carousel = document.createElement("div");
  carousel.className = `carousel slide ${data.id}-carousel`;
  carousel.id = "projectCarousel";
  carousel.setAttribute("data-bs-ride", "carousel");

  const indicators = document.createElement("div");
  indicators.className = "carousel-indicators";

  const inner = document.createElement("div");
  inner.className = "carousel-inner";

  const visibleItems = data.items.filter((item) => item.show);

  visibleItems.forEach((item, index) => {
    createCarouselIndicator(indicators, index);
    inner.appendChild(createCarouselItem(item, index, data.id));
  });

  carousel.append(indicators, inner);
  carousel.insertAdjacentHTML("beforeend", createCarouselControls());

  return carousel;
}

function createCarouselIndicator(container, index) {
  const indicator = document.createElement("button");
  indicator.setAttribute("data-bs-target", "#projectCarousel");
  indicator.setAttribute("data-bs-slide-to", index.toString());
  if (index === 0) indicator.classList.add("active");
  container.appendChild(indicator);
}

function createCarouselItem(item, index, sectionId) {
  const carouselItem = document.createElement("div");
  carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;

  const content = document.createElement("div");
  content.className = `project-content ${sectionId}-content`;

  content.append(
    createImageSection(item, sectionId),
    createDetailsSection(item, sectionId)
  );

  carouselItem.appendChild(content);
  return carouselItem;
}

function createImageSection(item, sectionId) {
  const imageSection = document.createElement("div");
  imageSection.className = `project-image ${sectionId}-image`;

  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.title;

  imageSection.appendChild(img);
  return imageSection;
}

function createDetailsSection(item, sectionId) {
  const details = document.createElement("div");
  details.className = `project-details ${sectionId}-details`;

  const subtitle = document.createElement("p");
  subtitle.className = `${sectionId}-subtitle`;
  subtitle.textContent = item.subtitle;

  const title = document.createElement("h3");
  title.className = `mb-3 ${sectionId}-title`;
  title.textContent = item.title;

  const description = createDescription(item, sectionId);
  const tools = createToolsList(item, sectionId);
  const links = item.links ? createLinks(item, sectionId) : null;

  details.append(subtitle, title, description, tools);
  if (links) details.appendChild(links);

  return details;
}

function createDescription(item, sectionId) {
  const description = document.createElement("div");
  description.className = `mb-4 ${sectionId}-description`;

  item.details.forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    description.appendChild(p);
  });

  return description;
}

function createToolsList(item, sectionId) {
  const tools = document.createElement("ul");
  tools.className = `project-tools ${sectionId}-tools`;

  item.tags.forEach((tool) => {
    const li = document.createElement("li");
    li.textContent = tool;
    tools.appendChild(li);
  });

  return tools;
}

function createLinks(item, sectionId) {
  const links = document.createElement("div");
  links.className = `project-links ${sectionId}-links mt-3`;

  item.links.forEach((link) => {
    if (link.show) {
      const a = document.createElement("a");
      a.href = link.url;
      a.className = "btn btn-primary me-2 mb-2";
      a.textContent = link.text;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      links.appendChild(a);
    }
  });

  return links;
}

function createCarouselControls() {
  return `
    <button class="carousel-control-prev" type="button" data-bs-target="#projectCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#projectCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  `;
}
