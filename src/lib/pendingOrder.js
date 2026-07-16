// Redirecting to PayFast is a real page navigation away from the site
// and back, so in-memory React state (cart, order history) doesn't
// survive the round trip. Stash the order here right before redirecting
// so it can be picked back up when PayFast returns.
const KEY = "clarinkie_pending_order";

export function savePendingOrder(order) {
  localStorage.setItem(KEY, JSON.stringify(order));
}

export function takePendingOrder() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  localStorage.removeItem(KEY);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
