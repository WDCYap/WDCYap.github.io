export default function createTimelineLayout(data) {
  const timeline = document.createElement("div");
  timeline.className = `timeline ${data.id}-timeline`;

  data.items.forEach((item, index) => {
    const timelineItem = document.createElement("div");
    timelineItem.className = `timeline-item ${data.id}-item`;
    timelineItem.style.setProperty("--index", index);

    const title = document.createElement("h4");
    title.className = `${data.id}-title`;
    title.textContent = item.title;

    const subtitle = document.createElement("p");
    subtitle.className = `${data.id}-subtitle institution`;
    subtitle.textContent = item.subtitle;

    const date = document.createElement("p");
    date.className = `${data.id}-date date`;
    date.textContent = item.date;

    const details = document.createElement("div");
    details.className = `${data.id}-details`;
    item.details.forEach((text) => {
      const p = document.createElement("p");
      p.className = `${data.id}-detail`;
      p.textContent = text;
      details.appendChild(p);
    });

    timelineItem.append(title, subtitle, date, details);
    timeline.appendChild(timelineItem);
  });

  return timeline;
}
