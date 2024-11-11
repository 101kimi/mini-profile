import { parse } from 'node-html-parser';

export async function getFaviconUrl(url: string): Promise<string> {
  try {
    const domain = new URL(url).hostname;
    const DEFAULT_FAVICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAS1BMVEX////e3t7d3d3f39/c3Nzg4ODh4eHb29vY2Nja2trX19fZ2dnV1dXU1NTT09PS0tLR0dHQ0NDPz8/Ozs7Nzc3MzMzLy8vKysrJycnwG9D7AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVQ4jWNgGAWjYBQMZ8BIQUVFRU1Dh4CKmoa2rp4+ARUNbV09A0MjYwIqmto6egaGRsZGALyYA7/Ux1xYAAAAAElFTkSuQmCC';

    try {
      const response = await fetch(url);
      const html = await response.text();
      const root = parse(html);
      
      // Try to find favicon in <link> tags
      const linkTags = root.querySelectorAll('link[rel*="icon"]');
      for (const tag of linkTags) {
        const href = tag.getAttribute('href');
        if (href) {
          const faviconUrl = href.startsWith('http') ? href : `https://${domain}${href}`;
          const response = await fetch(faviconUrl);
          if (response.ok) {
            return faviconUrl;
          }
        }
      }
    } catch {
      // Fallback to common favicon locations
      const faviconUrls = [
        `https://icon.horse/icon/${domain}`,
        `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        `https://${domain}/favicon.ico`
      ];

      for (const faviconUrl of faviconUrls) {
        try {
          const response = await fetch(faviconUrl);
          if (response.ok) {
            return faviconUrl;
          }
        } catch {
          continue;
        }
      }
    }

    return DEFAULT_FAVICON;
  } catch {
    return DEFAULT_FAVICON;
  }
}