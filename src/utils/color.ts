export function getLuminance(color: string): number {
  // Remove any leading #
  const hex = color.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Calculate relative luminance using the sRGB color space
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  return luminance;
}