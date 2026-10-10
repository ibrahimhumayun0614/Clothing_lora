const products = window.LoxoProducts;

const sizes = ["S", "M", "L", "XL"];
const gallery = document.querySelector("[data-gallery]");
const buy = document.querySelector("[data-buy]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const params = new URLSearchParams(window.location.search);
const product = products[params.get("item")] || products["airsmyth-shirt"];

let colorIndex = 0;
let size = "M";
let shotIndex = 0;

document.title = product.name + " — Loxo Fashion";

function renderGallery() {
  product.shots.forEach((shot, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-shot";
    button.setAttribute("aria-label", "Open image lightbox");
    const image = document.createElement("img");
    image.src = shot.src;
    image.alt = product.name + ", view " + (index + 1);
    image.style.objectPosition = shot.position;
    button.append(image);
    button.addEventListener("click", () => openLightbox(index));
    gallery.append(button);
  });
}

function renderBuy() {
  const crumbs = document.createElement("nav");
  crumbs.className = "crumbs";
  crumbs.setAttribute("aria-label", "Breadcrumb");
  crumbs.innerHTML =
    '<a href="index.html">Loxo Fashion</a><span aria-hidden="true">/</span>' +
    '<a href="index.html#men">' + product.group + "</a><span aria-hidden=\"true\">/</span>" +
    "<span>" + product.type + "</span>";

  const title = document.createElement("h1");
  title.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price-line";
  price.textContent = product.price;

  const note = document.createElement("p");
  note.className = "product-note";
  note.textContent = "Duties & taxes included. Free shipping over INR700.00.";

  const colorLabel = document.createElement("p");
  colorLabel.className = "option-label";
  colorLabel.id = "color-label";
  colorLabel.textContent = "Colour — " + product.colors[0].name;

  const colors = document.createElement("div");
  colors.className = "color-options";
  colors.setAttribute("role", "group");
  colors.setAttribute("aria-labelledby", "color-label");

  product.colors.forEach((color, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.style.background = color.hex;
    button.setAttribute("aria-label", color.name);
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    button.addEventListener("click", () => {
      colorIndex = index;
      colorLabel.textContent = "Colour — " + color.name;
      colors.querySelectorAll("button").forEach((item, itemIndex) => {
        item.setAttribute("aria-pressed", itemIndex === index ? "true" : "false");
      });
      status.textContent = "";
    });
    colors.append(button);
  });

  const sizeLabel = document.createElement("p");
  sizeLabel.className = "option-label";
  sizeLabel.id = "size-label";
  sizeLabel.textContent = "Size — M";

  const sizeGroup = document.createElement("div");
  sizeGroup.className = "size-options";
  sizeGroup.setAttribute("role", "group");
  sizeGroup.setAttribute("aria-labelledby", "size-label");

  sizes.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item;
    button.setAttribute("aria-pressed", item === "M" ? "true" : "false");
    button.addEventListener("click", () => {
      size = item;
      sizeLabel.textContent = "Size — " + item;
      sizeGroup.querySelectorAll("button").forEach((choice) => {
        choice.setAttribute("aria-pressed", choice.textContent === item ? "true" : "false");
      });
      status.textContent = "";
    });
    sizeGroup.append(button);
  });

  const order = document.createElement("button");
  order.type = "button";
  order.className = "order-submit";
  order.textContent = "Order now";

  const status = document.createElement("p");
  status.className = "order-status";
  status.setAttribute("role", "status");

  const copy = document.createElement("p");
  copy.className = "product-copy";
  copy.textContent = product.description;

  order.addEventListener("click", () => {
    const color = product.colors[colorIndex].name;
    window.LoxoOpenWhatsAppOrder({
      name: product.name,
      price: product.price,
      color,
      size,
    });
    status.textContent = "Opening WhatsApp to complete your order.";
  });

  buy.append(crumbs, title, price, note, colorLabel, colors, sizeLabel, sizeGroup, order, status, copy);
}

function showShot() {
  const shot = product.shots[shotIndex];
  lightboxImage.src = shot.src;
  lightboxImage.alt = product.name + ", view " + (shotIndex + 1);
  lightboxImage.style.objectPosition = shot.position;
}

function openLightbox(index) {
  shotIndex = index;
  showShot();
  lightbox.showModal();
}

document.querySelector("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
document.querySelector("[data-lightbox-prev]").addEventListener("click", () => {
  shotIndex = (shotIndex + product.shots.length - 1) % product.shots.length;
  showShot();
});
document.querySelector("[data-lightbox-next]").addEventListener("click", () => {
  shotIndex = (shotIndex + 1) % product.shots.length;
  showShot();
});
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

renderGallery();
renderBuy();
renderRelated();

function renderRelated() {
  const row = document.querySelector("[data-related]");
  const currentId = Object.keys(products).find((id) => products[id] === product);
  const sameType = Object.entries(products).filter(([id, item]) => id !== currentId && item.type === product.type);
  const others = Object.entries(products).filter(([id, item]) => id !== currentId && item.type !== product.type);

  sameType.concat(others).slice(0, 4).forEach(([id, item]) => {
    const article = document.createElement("article");
    article.className = "product";

    const swatches = item.colors
      .slice(0, 4)
      .map((color) => '<i style="background:' + color.hex + '"></i>')
      .join("");

    article.innerHTML =
      '<div class="product-photo" style="background-image:url(\'' + item.cover + '\')"><a class="product-open" href="product.html?item=' + id + '"><span class="visually-hidden">' + item.name + "</span></a></div>" +
      '<div class="swatch-row"><div class="swatches" aria-hidden="true">' + swatches + "</div><p class=\"product-price\">" + item.price + "</p></div>" +
      '<div class="product-meta"><p><a href="product.html?item=' + id + '">' + item.name + '</a></p><a class="order-now" href="product.html?item=' + id + '">Order now</a></div>';

    row.append(article);
  });
}
