import { Handlers } from "$fresh/server.ts";
import { blogImages } from "@/utils/blog.ts";
import {
  ImageMagick,
  IMagickImage,
  initialize,
  MagickFormat,
  MagickGeometry,
} from "imagemagick_deno/mod.ts";
import * as path from "$std/path/mod.ts";
import { serveFile } from "$std/http/file_server.ts";

await initialize();

const resizedImagesDir = path.join(Deno.cwd(), "resized_images");
await Deno.mkdir(resizedImagesDir, { recursive: true });

type ResizeParams = {
  imgPath: string;
  width: number;
  resolve: (data: Uint8Array) => void;
};

/**
 * ImageMagick instance can only be used sequentially.
 * Resizer acts as a semaphore to limit the concurrency.
 */
const resizer = (function () {
  const queue: ResizeParams[] = [];
  let running = false;

  async function doResize(
    { imgPath, width, resolve }: ResizeParams,
  ) {
    const data = await Deno.readFile(imgPath);
    let sourceFormat = MagickFormat.Jpeg;
    if (imgPath.endsWith(".png")) {
      sourceFormat = MagickFormat.Png;
    }

    // This must be sequential as it reuses a single buffer.
    const imgData = await ImageMagick.read(
      data,
      sourceFormat,
      (img: IMagickImage) => {
        if (img.width > width) {
          // Resize to a smaller size
          img.resize(new MagickGeometry(width));
        } else {
          // Keep original size
          img.resize(new MagickGeometry(img.width));
        }

        return img.write(
          MagickFormat.Png,
          (data) => data,
        );
      },
    );
    resolve(imgData);
  }

  async function processQueue() {
    if (!queue.length) {
      return;
    } else if (running) {
      return;
    }

    running = true;
    try {
      const params = queue.shift();
      await doResize(params!);
    } finally {
      running = false;
    }
    processQueue();
  }

  return {
    resize: (imgPath: string, width: number): Promise<Uint8Array> => {
      return new Promise((resolve) => {
        queue.push({ imgPath, width, resolve });
        processQueue();
      });
    },
  };
})();

export const handler: Handlers = {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const wStr = url.searchParams.get("w");
    const orig = url.searchParams.has("orig");

    if (!id) {
      console.warn("id param is missing");
      return new Response("id is missing", {
        status: 500,
      });
    }

    if (!wStr && !orig) {
      console.warn("w or orig params are missing");
      return new Response("w or orig params are missing", {
        status: 500,
      });
    }

    const img = blogImages.get(id);
    if (!img) {
      console.warn("img not found", id);
      return new Response("img not found", {
        status: 404,
      });
    }

    if (orig) {
      // Serve original image
      const res = await serveFile(req, img);
      if (url.searchParams.get("__frsh_c")) {
        res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
      }
      return res;
    }

    // Resize the image
    const w = parseInt(wStr!, 10);
    const imgHash = await genHash(img, w);
    const existingPath = path.join(resizedImagesDir, imgHash);

    try {
      await Deno.lstat(existingPath);
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
      }

      // Image not cached
      console.log("Resizing the image", "width", w, img);
      const resized = await resizer.resize(img, w);
      await Deno.writeFile(existingPath, resized);
    }

    const res = await serveFile(req, existingPath);

    if (url.searchParams.get("__frsh_c")) {
      res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    return res;
  },
};

async function genHash(imgPath: string, width: number): Promise<string> {
  const fileInfo = await Deno.lstat(imgPath);
  const hashData = `${imgPath}:${width}:${fileInfo.mtime?.getTime()}.png`;
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(hashData),
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("") + ".png";
}
