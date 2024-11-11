export async function fetchMetadata(url: string): Promise<{ title: string }> {
  try {
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return {
      title: data.data?.title || new URL(url).hostname
    };
  } catch {
    return {
      title: new URL(url).hostname
    };
  }
}