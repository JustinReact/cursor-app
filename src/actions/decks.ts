"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertDeck, updateDeck, deleteDeck, getDecksByUser } from "@/db/queries";

const createDeckSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

type CreateDeckInput = z.infer<typeof createDeckSchema>;

export async function createDeck(input: CreateDeckInput) {
  const { userId, has } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (has({ feature: "3_deck_limit" })) {
    const existing = await getDecksByUser(userId);
    if (existing.length >= 3) {
      throw new Error("Free plan is limited to 3 decks. Upgrade to Pro for unlimited decks.");
    }
  }

  const parsed = createDeckSchema.parse(input);

  await insertDeck({ ...parsed, userId });

  revalidatePath("/dashboard");
}

const updateDeckSchema = z.object({
  deckId: z.number().int().positive(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

export async function updateDeckAction(input: UpdateDeckInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = updateDeckSchema.parse(input);

  await updateDeck(parsed.deckId, userId, {
    title: parsed.title,
    description: parsed.description,
  });

  revalidatePath("/dashboard");
}

const deleteDeckSchema = z.object({
  deckId: z.number().int().positive(),
});

type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;

export async function deleteDeckAction(input: DeleteDeckInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = deleteDeckSchema.parse(input);

  await deleteDeck(parsed.deckId, userId);

  revalidatePath("/dashboard");
}
