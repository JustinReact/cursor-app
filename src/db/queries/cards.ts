import { db } from "@/db";
import { cardsTable, decksTable, InsertCard, SelectCard } from "@/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getCardsByDeck(
  deckId: number,
  userId: string
): Promise<SelectCard[]> {
  return db
    .select({ card: cardsTable })
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
    .where(and(eq(cardsTable.deckId, deckId), eq(decksTable.userId, userId)))
    .orderBy(desc(cardsTable.updatedAt))
    .then((rows) => rows.map((r) => r.card));
}

export async function insertCard(
  values: Omit<InsertCard, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  await db.insert(cardsTable).values(values);
}

export async function updateCard(
  cardId: number,
  userId: string,
  patch: Partial<Pick<InsertCard, "front" | "back" | "isArchived">>
): Promise<void> {
  const [row] = await db
    .select({ deckId: cardsTable.deckId })
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
    .where(and(eq(cardsTable.id, cardId), eq(decksTable.userId, userId)));

  if (!row) return;

  await db.update(cardsTable).set(patch).where(eq(cardsTable.id, cardId));
}

export async function deleteCard(
  cardId: number,
  userId: string
): Promise<void> {
  const [row] = await db
    .select({ cardId: cardsTable.id })
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
    .where(and(eq(cardsTable.id, cardId), eq(decksTable.userId, userId)));

  if (!row) return;

  await db.delete(cardsTable).where(eq(cardsTable.id, cardId));
}
