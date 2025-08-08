import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

export interface List {
  id: number;
  name: string;
  content: string;
  due_date: string | null;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface ListWithParsedTags extends Omit<List, "tags"> {
  tags: string[];
}

// Initialize database
export function initDatabase() {
  const createTable = `
    CREATE TABLE IF NOT EXISTS lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      content TEXT DEFAULT '',
      due_date TEXT,
      tags TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createTable);
}

export function getAllLists(): ListWithParsedTags[] {
  const lists = db
    .prepare("SELECT * FROM lists ORDER BY created_at DESC")
    .all() as List[];
  return lists.map((list) => ({
    ...list,
    tags: JSON.parse(list.tags || "[]"),
  }));
}

export function getListsWithDueDates(): ListWithParsedTags[] {
  const lists = db
    .prepare(
      "SELECT * FROM lists WHERE due_date IS NOT NULL ORDER BY due_date ASC",
    )
    .all() as List[];
  return lists.map((list) => ({
    ...list,
    tags: JSON.parse(list.tags || "[]"),
  }));
}

export function getListById(id: number): ListWithParsedTags | null {
  const list = db.prepare("SELECT * FROM lists WHERE id = ?").get(id) as
    | List
    | undefined;
  if (!list) return null;
  return {
    ...list,
    tags: JSON.parse(list.tags || "[]"),
  };
}

export function createList(
  name: string,
  content: string = "",
  dueDate: string | null = null,
  tags: string[] = [],
): number {
  const stmt = db.prepare(`
    INSERT INTO lists (name, content, due_date, tags, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  const result = stmt.run(name, content, dueDate, JSON.stringify(tags));
  return result.lastInsertRowid as number;
}

export function updateList(
  id: number,
  name: string,
  content: string,
  dueDate: string | null,
  tags: string[],
): void {
  const stmt = db.prepare(`
    UPDATE lists 
    SET name = ?, content = ?, due_date = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(name, content, dueDate, JSON.stringify(tags), id);
}

export function deleteList(id: number): void {
  const stmt = db.prepare("DELETE FROM lists WHERE id = ?");
  stmt.run(id);
}

export function getAllTags(): string[] {
  const lists = db.prepare("SELECT tags FROM lists").all() as {
    tags: string;
  }[];
  const allTags = new Set<string>();

  lists.forEach((list) => {
    const tags = JSON.parse(list.tags || "[]") as string[];
    tags.forEach((tag) => allTags.add(tag));
  });

  return Array.from(allTags).sort();
}

// Initialize database on import
initDatabase();

export default db;
