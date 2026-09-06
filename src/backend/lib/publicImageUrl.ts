export function getPublicImageUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  return `${process.env.R2_PUBLIC_BASE_URL}/${url}`;
}

