import { TYPING_SPEED } from "./constants.js";

export function initializeTypingAnimations() {
  const typedTextElement = document.getElementById("typed-text");
  if (!typedTextElement?.dataset.texts) return;

  const texts = JSON.parse(typedTextElement.dataset.texts);
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  typedTextElement.style.cssText =
    "overflow: hidden; white-space: nowrap; display: inline-block;";

  function type() {
    typedTextElement.textContent =
      texts[textIndex].substring(0, charIndex) + "\u00A0";

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    if (!isDeleting && charIndex === texts[textIndex].length) {
      setTimeout(() => (isDeleting = true), TYPING_SPEED.pause);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    setTimeout(type, isDeleting ? TYPING_SPEED.delete : TYPING_SPEED.type);
  }

  type();
}

export function initializeProfileImage() {
  const profileImage = document.querySelector(".profile-image");
  if (!profileImage) return;

  profileImage.style.opacity = "1";
  profileImage.classList.add("animate");
}

export function updateProfileImage(theme) {
  const profileImage = document.querySelector(".profile-image");
  if (!profileImage?.dataset.images) return;

  const images = JSON.parse(profileImage.dataset.images);
  const transitionDuration = 300;

  profileImage.classList.remove("animate");
  profileImage.style.cssText =
    "animation: none; opacity: 0; transform: translateX(50px);";

  setTimeout(() => {
    profileImage.src = images[theme];
    void profileImage.offsetWidth; // Force reflow
    profileImage.style.animation = "";
    profileImage.classList.add("animate");
  }, transitionDuration);
}
