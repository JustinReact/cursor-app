import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getDeckById, getCardsByDeck } from "@/db/queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AddCardDialog } from "@/components/add-card-dialog";
import { EditCardDialog } from "@/components/edit-card-dialog";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { deckId } = await params;
  const id = Number(deckId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [deck, cards] = await Promise.all([
    getDeckById(id, userId),
    getCardsByDeck(id, userId),
  ]);

  if (!deck) notFound();

  return (
    <main className="flex flex-1 flex-col gap-8 px-6 py-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <Link href="/dashboard">&larr; Dashboard</Link>
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{deck.title}</h1>
          {deck.description && (
            <p className="text-muted-foreground mt-1">{deck.description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {cards.length > 0 && (
            <Button size="sm">
              <Link href={`/decks/${id}/study`}>Study</Link>
            </Button>
          )}
          <AddCardDialog deckId={id} />
        </div>
      </div>

      <Separator />

      {cards.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed">
          <CardContent>
            <p className="text-muted-foreground">No cards in this deck yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Use the &ldquo;Add Card&rdquo; button above to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.id}>
              <Card className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Front
                    </CardTitle>
                    <EditCardDialog card={card} deckId={id} />
                  </div>
                  <p className="text-foreground">{card.front}</p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Back
                  </p>
                  <p className="text-foreground">{card.back}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
