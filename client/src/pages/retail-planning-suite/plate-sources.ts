/**
 * Resolves the photographic plates' responsive sources.
 *
 * `scripts/build-plate-derivatives.mjs` writes each plate as
 * `<name>-<width>.<avif|webp|jpg>` into client/src/assets/retail. Rather than
 * spell out nine imports per plate, this globs the directory the way
 * ConnectorMark does and assembles the srcsets from the filenames — so adding
 * a width, or a whole plate, means rerunning the script and nothing else.
 */

type Format = "avif" | "webp" | "jpg";

const FILES = import.meta.glob("../../assets/retail/*.{avif,webp,jpg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export interface PlateSources {
  /** Widest JPEG, for the <img> element's own src. */
  src: string;
  /** One srcset per format, widest-first order irrelevant — the browser sorts. */
  srcSets: { type: string; srcSet: string }[];
  width: number;
  height: number;
}

const MIME: Record<Format, string> = {
  avif: "image/avif",
  webp: "image/webp",
  jpg: "image/jpeg",
};

// name -> format -> [width, url]
const byName = new Map<string, Map<Format, [number, string][]>>();

for (const [path, url] of Object.entries(FILES)) {
  const file = path.split("/").pop();
  if (!file) continue;
  const match = file.match(/^(.+)-(\d+)\.(avif|webp|jpg)$/);
  if (!match) continue;
  const [, name, width, format] = match;
  if (!byName.has(name)) byName.set(name, new Map());
  const formats = byName.get(name)!;
  if (!formats.has(format as Format)) formats.set(format as Format, []);
  formats.get(format as Format)!.push([Number(width), url]);
}

/**
 * Returns the sources for a plate, or null when its derivatives have not been
 * built yet — which is how the page keeps rendering the marked-up placeholder
 * for a plate whose photograph is still outstanding.
 *
 * `ratio` is passed in rather than read off the file because the intrinsic
 * size only exists at runtime, and the width/height attributes have to be on
 * the element before layout to reserve the space and avoid a shift.
 */
export const plateSources = (name: string, ratio: number): PlateSources | null => {
  const formats = byName.get(name);
  if (!formats) return null;

  const jpgs = formats.get("jpg");
  if (!jpgs?.length) return null;

  const widest = jpgs.reduce((a, b) => (a[0] > b[0] ? a : b));
  const srcSets = (["avif", "webp", "jpg"] as Format[])
    .filter((format) => formats.get(format)?.length)
    .map((format) => ({
      type: MIME[format],
      srcSet: formats
        .get(format)!
        .sort((a, b) => a[0] - b[0])
        .map(([width, url]) => `${url} ${width}w`)
        .join(", "),
    }));

  return {
    src: widest[1],
    srcSets,
    width: widest[0],
    height: Math.round(widest[0] / ratio),
  };
};
