import { loadPosts } from "@/utils/blog.ts";
import * as path from "$std/path/mod.ts";
import manifest from "@/fresh.gen.ts";
import twindPlugin from "$fresh/plugins/twindv1.ts";
import twindConfig from "@/twind.config.ts";
import { ServerContext } from "$fresh/server.ts";
import * as fs from "$std/fs/mod.ts";

const buildDir = path.join(Deno.cwd(), "build");
await Deno.mkdir(buildDir, { recursive: true });

await genPosts();
await genSnapshot();

/** Generate a single file to import all blog posts from */
async function genPosts() {
  const { posts, images } = await loadPosts();

  const postsCache = path.join(buildDir, "posts.gen.ts");
  const postsImport = [...posts.entries()].map(([slug, p]) =>
    `blogPosts.set("${slug}", ${JSON.stringify(p)});`
  ).join("\n");
  const imagesImport = [...images.entries()].map(([key, value]) =>
    `blogImages.set("${key}", "${value}");`
  ).join("\n");
  const content = `// DO NOT EDIT. This file is autogenerated.

import { BlogPost } from "@/utils/blog.ts";

export const blogPosts: Map<string, BlogPost> = new Map();
export const blogImages: Map<string, string> = new Map();

${postsImport}

${imagesImport}
`;

  try {
    const existing = await Deno.readTextFile(postsCache);
    if (existing == content) {
      // Skip writing to a file (nothing changed)
      console.log("Posts haven't changed");
      return;
    }
  } catch (_e) {
    // No op
  }

  console.log("Updating posts.gen.ts");
  await Deno.writeTextFile(postsCache, content);
}

/** Generate ESBuild snapshot */
async function genSnapshot() {
  const t0 = performance.now();

  const ctx = await ServerContext.fromManifest(manifest, {
    plugins: [twindPlugin(twindConfig)],
  });
  const snapshot = await ctx.buildSnapshot();

  const filesDir = path.join(buildDir, "files");
  await Deno.mkdir(filesDir, { recursive: true });
  await fs.emptyDir(filesDir);

  console.log("Will write", snapshot.paths.length, "build files");
  const paths = snapshot.paths;
  for (const p of paths) {
    const data = snapshot.read(p)!;
    await Deno.writeFile(path.join(filesDir, p), data);
  }

  const deps: Record<string, string[]> = {};
  for (const p of snapshot.paths) {
    const v = snapshot.dependencies(p);
    deps[p] = v;
  }

  const content = JSON.stringify({ deps, paths }, null, 2);
  console.log("Writing build.snapshot.json");
  await Deno.writeTextFile(path.join(buildDir, "build.snapshot.json"), content);

  const t1 = performance.now();
  console.log(`Built a snapshot in ${t1 - t0}ms`);
}
