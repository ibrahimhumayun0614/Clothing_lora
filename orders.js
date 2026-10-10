const LOXO_WHATSAPP_PHONE = "917200148318";

function buildWhatsAppOrderMessage({ name, price, color, size }) {
  const lines = ["Hello, I would like to order from Loxo Fashion:", "", "Product: " + name];
  if (price) lines.push("Price: " + price);
  if (color) lines.push("Colour: " + color);
  if (size) lines.push("Size: " + size);
  return lines.join("\n");
}

window.LoxoOpenWhatsAppOrder = function (details) {
  const url =
    "https://wa.me/" + LOXO_WHATSAPP_PHONE + "?text=" + encodeURIComponent(buildWhatsAppOrderMessage(details));
  window.open(url, "_blank", "noopener,noreferrer");
};

function orderItemIdFromLink(link) {
  if (link.dataset.orderItem) return link.dataset.orderItem;
  const match = (link.getAttribute("href") || "").match(/[?&]item=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a.order-now");
  if (!link) return;

  const catalog = window.LoxoProducts;
  if (!catalog) return;

  const itemId = orderItemIdFromLink(link);
  const item = itemId ? catalog[itemId] : null;
  if (!item) return;

  event.preventDefault();
  window.LoxoOpenWhatsAppOrder({
    name: item.name,
    price: item.price,
    color: link.dataset.orderColor || "",
    size: link.dataset.orderSize || "",
  });
});
