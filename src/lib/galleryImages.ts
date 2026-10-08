/**
 * Responsive delivery for the gallery photography.
 *
 * Every gallery photo wider than 720px also ships a 640px copy beside it
 * (`wedding-17.webp` -> `wedding-17-640.webp`; made by scripts/generate-gallery-variants.mjs).
 * The 640px file averages about 40% of the full file's bytes, which matters on card
 * thumbnails that paint 350-400 CSS px wide. This table lists the intrinsic width of
 * each photo that has such a variant, so `gallerySrcSet` can offer both and let the
 * browser fetch the smaller one wherever the image is painted small.
 *
 * Photos not listed (narrow originals, and everything outside /media/gallery) return
 * undefined and render exactly as before. Wide photos (wider than 3:2) are left out
 * on purpose: `object-cover` in a short card crops them by height, so they paint
 * wider than the card itself and the 640px copy would be stretched. Add a row here
 * when you add a variant.
 */
const FULL_WIDTH: Record<string, number> = {
  'wedding-1': 1043,
  'wedding-4': 970,
  'wedding-5': 960,
  'wedding-6': 900,
  'wedding-7': 960,
  'wedding-11': 864,
  'wedding-14': 994,
  'wedding-15': 960,
  'wedding-16': 1200,
  'wedding-17': 1200,
  'wedding-18': 960,
  'wedding-19': 1200,
  'wedding-20': 1200,
  'wedding-21': 1200,
  'wedding-22': 960,
  'wedding-23': 1080,
  'wedding-24': 960,
  'wedding-25': 1080,
  'wedding-28': 810,
  'wedding-29': 960,
  'wedding-30': 1200,
  'wedding-31': 735,
  'wedding-32': 736,
  'celebration-1': 864,
  'celebration-2': 960,
  'celebration-3': 1080,
  'celebration-4': 960,
  'celebration-5': 854,
  'celebration-6': 1200,
  'celebration-7': 960,
  'celebration-8': 853,
  'celebration-9': 960,
  'celebration-10': 854,
  'celebration-11': 735,
  'celebration-14': 960,
  'celebration-16': 960,
  'celebration-17': 900,
  'corporate-1': 1200,
  'corporate-5': 1200,
  'corporate-6': 1200,
  'corporate-7': 1200,
  'detail-2': 736,
  'detail-3': 900,
  'detail-4': 750,
  'detail-6': 736,
  'detail-7': 1080,
  'detail-9': 810,
};

/** `srcSet` offering the 640px variant and the full file, or undefined when no variant exists. */
export function gallerySrcSet(src: string): string | undefined {
  const m = /^\/media\/gallery\/([a-z]+-\d+)\.webp$/.exec(src);
  const width = m ? FULL_WIDTH[m[1]] : undefined;
  return m && width ? `/media/gallery/${m[1]}-640.webp 640w, ${src} ${width}w` : undefined;
}

/**
 * Spread onto an `<img src={src}>`: `srcSet` plus the `sizes` that describe where it is
 * painted, or nothing at all for an image without a variant (so its markup is unchanged).
 */
export function galleryImgProps(src: string, sizes: string): { srcSet?: string; sizes?: string } {
  const srcSet = gallerySrcSet(src);
  return srcSet ? { srcSet, sizes } : {};
}

/**
 * `sizes` hints for the layouts that use these images, worked out from the grids in
 * the 1200px page container (24px gutter on phones, 40px from md up). Keep them
 * honest: an understated size makes the browser pick the 640px file where a larger
 * one is needed, and the photo looks soft; a slight overstatement only costs bytes.
 * Full-bleed heroes and height-filled stacked cards are not listed: they paint wider
 * than 640px at any pixel density worth serving, so they keep the full file.
 */
export const GALLERY_SIZES = {
  /** services / blog / related-card grids: 1 column, 2 from sm, 3 from lg */
  card: '(min-width: 1280px) 360px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, calc(100vw - 48px)',
  /** portfolio grid: 1 column, 2 from md */
  twoUp: '(min-width: 1280px) 544px, (min-width: 768px) 45vw, calc(100vw - 48px)',
  /** image half of a text + image section: stacked, side by side from lg */
  half: '(min-width: 1280px) 520px, (min-width: 1024px) 43vw, calc(100vw - 48px)',
} as const;
