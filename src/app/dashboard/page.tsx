import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDecksByUser } from "@/db/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateDeckDialog } from "@/components/create-deck-dialog";
import { EditDeckDialog } from "@/components/edit-deck-dialog";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId, has } = await auth();
  if (!userId) redirect("/");

  const decks = await getDecksByUser(userId);
  const limitReached = has({ feature: "3_deck_limit" }) && decks.length >= 3;

  return (
    <main className="flex flex-1 flex-col gap-8 px-6 py-8 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your flashcard decks</p>
      </div>

      {decks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed">
          <CardContent>
            <p className="text-muted-foreground">You have no decks yet.</p>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <li key={deck.id} className="relative group">
              <Link
                href={`/decks/${deck.id}`}
                className="block"
                style={{ textDecoration: "none" }}
              >
                <Card className="flex flex-col transition-shadow hover:shadow-lg cursor-pointer focus:ring-2 focus:ring-primary outline-none">
                  <CardHeader>
                    <CardTitle className="truncate pr-7">{deck.title}</CardTitle>
                    {deck.description && (
                      <CardDescription className="line-clamp-2">
                        {deck.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardFooter className="pt-4">
                    <span className="text-xs text-muted-foreground">
                      Last updated: {deck.updatedAt instanceof Date ? deck.updatedAt.toLocaleString() : new Date(deck.updatedAt).toLocaleString()}
                    </span>
                  </CardFooter>
                </Card>
              </Link>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <EditDeckDialog deck={deck} />
              </div>
            </li>
          ))}
        </ul>
   
      )} 

      <div className="flex justify-center">
        <CreateDeckDialog limitReached={limitReached} />
      </div>
    </main>
  );
}
