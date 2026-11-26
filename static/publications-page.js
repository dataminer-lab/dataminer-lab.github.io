"use strict";

const publicationList = document.querySelector("#publication-list");

function makeElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function createPublication(item) {
  const article = makeElement("article", "publication-item");

  const figure = makeElement("div", "publication-figure");
  const imagePath = String(item.image || "");

  if (/^publication-assets\/[0-9a-f]{32}\.(png|jpg|webp)$/.test(imagePath)) {
    const image = document.createElement("img");
    image.src = `../${imagePath}?v=${encodeURIComponent(item.updated_at || "")}`;
    image.alt = item.image_alt || item.title || "Publication figure";
    image.loading = "lazy";
    figure.append(image);
  } else {
    figure.append(makeElement("span", "", "Figure unavailable"));
  }

  const info = makeElement("div", "publication-info");

  info.append(
    makeElement(
      "h2",
      "publication-title",
      item.title || "Untitled publication"
    )
  );

  info.append(
    makeElement(
      "p",
      "publication-authors",
      item.authors || ""
    )
  );

  info.append(
    makeElement(
      "p",
      "publication-venue",
      [item.venue, item.year].filter(Boolean).join(", ")
    )
  );

  if (item.url) {
    const link = makeElement("a", "publication-link", "Paper ↗");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    info.append(link);
  }

  article.append(figure, info);
  return article;
}

async function loadPublications() {
  try {
    const response = await fetch(
      `../publications.json?v=${Date.now()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const items = await response.json();

    publicationList.replaceChildren();

    if (!Array.isArray(items) || items.length === 0) {
      publicationList.append(
        makeElement(
          "p",
          "publication-empty",
          "No publications available."
        )
      );
      return;
    }

    items.forEach((item) => {
      publicationList.append(createPublication(item));
    });
  } catch (error) {
    console.error("Failed to load publications:", error);

    publicationList.replaceChildren(
      makeElement(
        "p",
        "publication-empty",
        "Publications could not be loaded."
      )
    );
  }
}

loadPublications();
