"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SelectCard } from "@/schema";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function StudySession({
  cards: initialCards,
  deckId,
  deckTitle,
}: {
  cards: SelectCard[];
  deckId: number;
  deckTitle: string;
}) {
  const [cards, setCards] = useState<SelectCard[]>(() => shuffle(initialCards));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const current = cards[index];
  const total = cards.length;

  const flip = useCallback(() => setFlipped((f) => !f), []);

  const next = useCallback(() => {
    if (index + 1 >= total) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }, [index, total]);

  const prev = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setFlipped(false);
    }
  }, [index]);

  const restart = useCallback(() => {
    setCards(shuffle(initialCards));
    setIndex(0);
    setFlipped(false);
    setDone(false);
  }, [initialCards]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === " ") {
        e.preventDefault();
        flip();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flip, next, prev]);

  if (done) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <div className="text-6xl select-none">🎉</div>
        <h2 className="text-2xl font-bold">Deck complete!</h2>
        <p className="text-muted-foreground">
          You&rsquo;ve gone through all {total} card{total !== 1 ? "s" : ""}.
        </p>
        <div className="flex gap-3">
          <Button onClick={restart}>
            <RotateCcw className="size-4" />
            Study Again
          </Button>
          <Button variant="outline">
            <Link href={`/decks/${deckId}`}>Back to Deck</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 py-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" size="sm">
          <Link href={`/decks/${deckId}`}>&larr; {deckTitle}</Link>
        </Button>
        <span className="text-sm text-muted-foreground tabular-nums font-medium">
          {index + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-[width] duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={flip}
        role="button"
        aria-label={flipped ? "Hide answer" : "Reveal answer"}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && flip()}
      >
        <div
          className="relative w-full h-64 md:h-80"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.45s ease",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border bg-card text-card-foreground p-8 shadow-md overflow-auto"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Front
            </p>
            <p className="text-xl md:text-2xl font-medium text-center leading-relaxed">
              {current.front}
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border bg-secondary text-secondary-foreground p-8 shadow-md overflow-auto"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Back
            </p>
            <p className="text-xl md:text-2xl font-medium text-center leading-relaxed">
              {current.back}
            </p>
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground">
        Click the card or press{" "}
        <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono text-xs">
          Space
        </kbd>{" "}
        to flip
      </p>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous card"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <Button variant="outline" onClick={flip} className="min-w-36">
          {flipped ? "Hide answer" : "Reveal answer"}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={next}
          aria-label={index + 1 >= total ? "Finish" : "Next card"}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-muted-foreground text-center pb-4">
        <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono text-xs">
          ←
        </kbd>{" "}
        <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono text-xs">
          →
        </kbd>{" "}
        to navigate between cards
      </p>
    </div>
  );
}
