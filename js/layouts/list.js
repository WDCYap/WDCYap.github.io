export default function createListLayout(data) {
  const list = document.createElement("div");
  list.className = `row g-4 ${data.id}-list`;

  const col = document.createElement("div");
  col.className = "col-md-6";

  data.items.forEach((item, index) => {
    if (item.show) {
      col.appendChild(createListItem(item, index, data.id));
    }
  });

  list.appendChild(col);
  return list;
}

const ICON_MAP = {
  email: "fas fa-envelope",
  phone: "fas fa-phone",
  linkedin: "fab fa-linkedin",
  github: "fab fa-github",
  resume: "fas fa-file-pdf",
  website: "fas fa-globe",
  twitter: "fab fa-twitter",
  instagram: "fab fa-instagram",
  facebook: "fab fa-facebook",
};

function createListItem(item, index, sectionId) {
  const link = document.createElement("a");
  link.className = `contact-info ${sectionId}-item`;
  link.style.setProperty("--index", index);

  const iconClass = ICON_MAP[item.type] || "fas fa-link";

  if (item.type === "resume") {
    setupResumeLink(link, item);
  } else {
    setupExternalLink(link, item);
  }

  const icon = document.createElement("i");
  icon.className = `${iconClass} ${sectionId}-icon`;

  const span = document.createElement("span");
  span.className = `${sectionId}-text`;
  span.textContent = item.text;

  link.append(icon, span);
  return link;
}

function setupResumeLink(link, item) {
  link.href = "#";
  link.setAttribute("data-bs-toggle", "modal");
  link.setAttribute("data-bs-target", "#resumeModal");

  const resumePreview = document.getElementById("resume-preview");
  const resumeDownload = document.getElementById("resume-download");
  if (resumePreview) resumePreview.src = item.value;
  if (resumeDownload) resumeDownload.href = item.value;
}

function setupExternalLink(link, item) {
  switch (item.type) {
    case "email":
      link.href = `mailto:${item.value}`;
      break;
    case "phone":
      link.href = `tel:${item.value}`;
      break;
    default:
      link.href = item.value;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
  }
}
