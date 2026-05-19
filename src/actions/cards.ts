"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertCard, updateCard, deleteCard } from "@/db/queries";

const createCardSchema = z.object({
  deckId: z.number().int().positive(),
  front: z.string().min(1, "Front is required").max(1000),
  back: z.string().min(1, "Back is required").max(1000),
});

const updateCardSchema = z.object({
  cardId: z.number().int().positive(),
  deckId: z.number().int().positive(),
  front: z.string().min(1, "Front is required").max(1000),
  back: z.string().min(1, "Back is required").max(1000),
});

type CreateCardInput = z.infer<typeof createCardSchema>;
type UpdateCardInput = z.infer<typeof updateCardSchema>;

export async function createCard(input: CreateCardInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = createCardSchema.parse(input);

  await insertCard({ deckId: parsed.deckId, front: parsed.front, back: parsed.back });

  revalidatePath(`/decks/${parsed.deckId}`);
}

export async function updateCardAction(input: UpdateCardInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = updateCardSchema.parse(input);

  await updateCard(parsed.cardId, userId, { front: parsed.front, back: parsed.back });

  revalidatePath(`/decks/${parsed.deckId}`);
}

const deleteCardSchema = z.object({
  cardId: z.number().int().positive(),
  deckId: z.number().int().positive(),
});

type DeleteCardInput = z.infer<typeof deleteCardSchema>;

export async function deleteCardAction(input: DeleteCardInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = deleteCardSchema.parse(input);

  await deleteCard(parsed.cardId, userId);

  revalidatePath(`/decks/${parsed.deckId}`);
}
