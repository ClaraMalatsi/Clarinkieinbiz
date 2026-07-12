// Resolve product images through Vite so they work in production builds
// (dev-server paths like /src/assets/... 404 once deployed).
const images = import.meta.glob("../assets/Images/*", {
  eager: true,
  query: "?url",
  import: "default",
});

export function productImage(fileName) {
  if (!fileName) return null;
  for (const [path, url] of Object.entries(images)) {
    if (path.endsWith("/" + fileName)) return url;
  }
  return null;
}
