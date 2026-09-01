export function getPublicImageUrl(url?: string) {
  if (!url) return "";
  return `${process.env.R2_PUBLIC_BASE_URL}/${url}`;
}
