import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getDeckById, getCardsByDeck } from "@/db/queries";
import { StudySession } from "@/components/study-session";
import { Button } from "@/components/ui/button";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { deckId } = await params;
  const id = Number(deckId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [deck, allCards] = await Promise.all([
    getDeckById(id, userId),
    getCardsByDeck(id, userId),
  ]);

  if (!deck) notFound();

  const cards = allCards.filter((c) => !c.isArchived);

  if (cards.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-6 py-12">
        <h1 className="text-2xl font-bold">{deck.title}</h1>
        <p className="text-muted-foreground">
          This deck has no cards to study yet.
        </p>
        <Button variant="outline" size="sm">
          <Link href={`/decks/${id}`}>&larr; Back to deck</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <StudySession cards={cards} deckId={id} deckTitle={deck.title} />
    </main>
  );
}
