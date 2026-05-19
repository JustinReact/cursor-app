import { db } from "@/db";
import { decksTable, InsertDeck, SelectDeck } from "@/schema";
import { and, eq } from "drizzle-orm";

export async function getDecksByUser(userId: string): Promise<SelectDeck[]> {
  return db.select().from(decksTable).where(eq(decksTable.userId, userId));
}

export async function getDeckById(
  deckId: number,
  userId: string
): Promise<SelectDeck | undefined> {
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)));
  return deck;
}

export async function insertDeck(
  values: Omit<InsertDeck, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  await db.insert(decksTable).values(values);
}

export async function updateDeck(
  deckId: number,
  userId: string,
  patch: Partial<Pick<InsertDeck, "title" | "description">>
): Promise<void> {
  await db
    .update(decksTable)
    .set(patch)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)));
}

export async function deleteDeck(deckId: number, userId: string): Promise<void> {
  await db
    .delete(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)));
}
