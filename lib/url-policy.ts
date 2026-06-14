export function requireHttpsUrl(rawUrl: string, sourceName: string): string {
  const parsedUrl = new URL(rawUrl);

  if (parsedUrl.protocol !== "https:") {
    throw new Error(`${sourceName} must use HTTPS. Received: ${rawUrl}`);
  }

  parsedUrl.hash = "";
  return parsedUrl.toString();
}
