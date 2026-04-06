import { promises as fs } from "fs";
import path from "path";
import type { LocalScheduledPost } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "scheduled-posts.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.writeFile(FILE_PATH, "[]", "utf-8");
  }
}

export async function readAll(): Promise<LocalScheduledPost[]> {
  await ensureFile();
  const raw = await fs.readFile(FILE_PATH, "utf-8");
  return JSON.parse(raw) as LocalScheduledPost[];
}

export async function writeAll(posts: LocalScheduledPost[]) {
  await ensureFile();
  await fs.writeFile(FILE_PATH, JSON.stringify(posts, null, 2), "utf-8");
}

export async function findById(id: string): Promise<LocalScheduledPost | undefined> {
  const all = await readAll();
  return all.find((p) => p.id === id);
}

export async function create(
  post: Omit<LocalScheduledPost, "id" | "createdAt" | "updatedAt" | "status">
): Promise<LocalScheduledPost> {
  const all = await readAll();
  const now = new Date().toISOString();
  const newPost: LocalScheduledPost = {
    id: `sched-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    ...post,
  };
  all.push(newPost);
  await writeAll(all);
  return newPost;
}

export async function update(
  id: string,
  data: Partial<Pick<LocalScheduledPost, "content" | "platform" | "scheduledAt" | "status">>
): Promise<LocalScheduledPost | null> {
  const all = await readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
  await writeAll(all);
  return all[idx];
}

export async function remove(id: string): Promise<boolean> {
  const all = await readAll();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) return false;
  await writeAll(filtered);
  return true;
}
